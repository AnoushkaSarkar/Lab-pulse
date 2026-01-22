import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables. Set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const generateSessionCode = (length = 8) => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < length; i += 1) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

const fetchStudentsWithSubmissions = async (sessionId) => {
    const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select('*')
        .eq('session_id', sessionId);

    if (studentsError) {
        throw studentsError;
    }

    const { data: submissionsData, error: submissionsError } = await supabase
        .from('submissions')
        .select('*')
        .eq('session_id', sessionId);

    if (submissionsError) {
        throw submissionsError;
    }

    const studentsMap = {};

    (studentsData || []).forEach((student) => {
        studentsMap[student.roll_no] = {
            name: student.name,
            rollNo: student.roll_no,
            taskStatus: student.task_status || {},
            submissions: {}
        };
    });

    (submissionsData || []).forEach((submission) => {
        const student = studentsMap[submission.roll_no] || {};
        student.submissions = student.submissions || {};
        student.submissions[submission.task_idx] = {
            code: submission.code,
            output: submission.output,
            timestamp: submission.created_at || submission.timestamp
        };
        studentsMap[submission.roll_no] = student;
    });

    return studentsMap;
};

export const createSession = async (sessionData) => {
    const sessionId = generateSessionCode();

    const { error } = await supabase.from('sessions').insert({
        id: sessionId,
        name: sessionData.name,
        tasks: sessionData.tasks || [],
        is_active: true
    });

    if (error) {
        throw error;
    }

    return sessionId;
};

export const getSession = async (sessionId) => {
    const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

    if (error && error.code === 'PGRST116') {
        return null;
    }

    if (error) {
        throw error;
    }

    return data;
};

export const joinSession = async (sessionId, studentData) => {
    const session = await getSession(sessionId);
    if (!session) {
        throw new Error('Session not found');
    }

    const taskStatus = {};
    (session.tasks || []).forEach((_, index) => {
        taskStatus[index] = 'not-started';
    });

    const { error } = await supabase
        .from('students')
        .upsert(
            {
                session_id: sessionId,
                name: studentData.name,
                roll_no: studentData.rollNo,
                task_status: taskStatus
            },
            { onConflict: 'session_id,roll_no' }
        );

    if (error) {
        throw error;
    }

    localStorage.setItem(`student_${sessionId}`, JSON.stringify(studentData));
    return true;
};

export const submitTask = async (sessionId, rollNo, taskIndex, submission) => {
    const timestamp = new Date().toISOString();

    const { data: student, error: studentError } = await supabase
        .from('students')
        .select('task_status')
        .eq('session_id', sessionId)
        .eq('roll_no', rollNo)
        .single();

    if (studentError) {
        throw studentError;
    }

    const updatedTaskStatus = {
        ...(student?.task_status || {}),
        [taskIndex]: 'completed'
    };

    const { error: submissionError } = await supabase.from('submissions').upsert(
        {
            session_id: sessionId,
            roll_no: rollNo,
            task_idx: taskIndex,
            code: submission.code,
            output: submission.output,
            timestamp
        },
        { onConflict: 'session_id,roll_no,task_idx' }
    );

    if (submissionError) {
        throw submissionError;
    }

    const { error: statusError } = await supabase
        .from('students')
        .update({ task_status: updatedTaskStatus })
        .eq('session_id', sessionId)
        .eq('roll_no', rollNo);

    if (statusError) {
        throw statusError;
    }
};

export const listenToStudents = (sessionId, callback) => {
    let active = true;

    const refresh = async () => {
        const data = await fetchStudentsWithSubmissions(sessionId);
        if (active) {
            callback(data);
        }
    };

    refresh();

    const channel = supabase
        .channel(`session-${sessionId}`)
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'students', filter: `session_id=eq.${sessionId}` },
            refresh
        )
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'submissions', filter: `session_id=eq.${sessionId}` },
            refresh
        )
        .subscribe();

    return () => {
        active = false;
        supabase.removeChannel(channel);
    };
};