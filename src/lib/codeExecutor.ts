// Code execution service for different programming languages
// This is a mock implementation - in production, you'd use a proper code execution service

export type Language = "javascript" | "python" | "java" | "cpp";

export interface ExecutionResult {
  output: string;
  error?: string;
  executionTime: number;
}

export interface TestCaseResult {
  testCaseId: string;
  passed: boolean;
  actualOutput: string;
  error?: string;
  executionTime: number;
}

class CodeExecutor {
  // Mock code execution - in production, this would call a real code execution service
  async executeCode(language: Language, code: string, input: string = ""): Promise<ExecutionResult> {
    // Simulate execution time
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

    try {
      let output = "";
      
      switch (language) {
        case "javascript":
          output = this.executeJavaScript(code, input);
          break;
        case "python":
          output = this.executePython(code, input);
          break;
        case "java":
          output = this.executeJava(code, input);
          break;
        case "cpp":
          output = this.executeCpp(code, input);
          break;
        default:
          throw new Error(`Unsupported language: ${language}`);
      }

      return {
        output,
        executionTime: 500 + Math.random() * 1000
      };
    } catch (error) {
      return {
        output: "",
        error: error instanceof Error ? error.message : "Unknown error occurred",
        executionTime: 500 + Math.random() * 1000
      };
    }
  }

  // Mock JavaScript execution
  private executeJavaScript(code: string, input: string): string {
    try {
      // Simple mock execution - in reality, you'd use a sandboxed environment
      if (code.includes("console.log")) {
        const matches = code.match(/console\.log\((.*?)\)/g);
        if (matches) {
          return matches.map(match => {
            const content = match.replace(/console\.log\((.*?)\)/, "$1");
            return eval(content);
          }).join("\n");
        }
      }
      
      // Simple arithmetic examples
      if (code.includes("2 + 2")) return "4";
      if (code.includes("5 * 10")) return "50";
      if (code.includes("Hello")) return "Hello World";
      
      return "Code executed successfully";
    } catch (error) {
      throw new Error("JavaScript execution error");
    }
  }

  // Mock Python execution
  private executePython(code: string, input: string): string {
    try {
      // Simple mock execution
      if (code.includes("print(")) {
        const matches = code.match(/print\((.*?)\)/g);
        if (matches) {
          return matches.map(match => {
            const content = match.replace(/print\((.*?)\)/, "$1").replace(/['"]/g, "");
            return content;
          }).join("\n");
        }
      }
      
      // Simple examples
      if (code.includes("2 + 2")) return "4";
      if (code.includes("5 * 10")) return "50";
      if (code.includes("Hello")) return "Hello World";
      
      return "Code executed successfully";
    } catch (error) {
      throw new Error("Python execution error");
    }
  }

  // Mock Java execution
  private executeJava(code: string, input: string): string {
    try {
      // Simple mock execution
      if (code.includes("System.out.println")) {
        const matches = code.match(/System\.out\.println\((.*?)\)/g);
        if (matches) {
          return matches.map(match => {
            const content = match.replace(/System\.out\.println\((.*?)\)/, "$1").replace(/['"]/g, "");
            return content;
          }).join("\n");
        }
      }
      
      // Simple examples
      if (code.includes("2 + 2")) return "4";
      if (code.includes("5 * 10")) return "50";
      if (code.includes("Hello")) return "Hello World";
      
      return "Code executed successfully";
    } catch (error) {
      throw new Error("Java execution error");
    }
  }

  // Mock C++ execution
  private executeCpp(code: string, input: string): string {
    try {
      // Simple mock execution
      if (code.includes("cout")) {
        const matches = code.match(/cout\s*<<\s*(.*?)\s*<<\s*endl/g);
        if (matches) {
          return matches.map(match => {
            const content = match.replace(/cout\s*<<\s*(.*?)\s*<<\s*endl/, "$1").replace(/['"]/g, "");
            return content;
          }).join("\n");
        }
      }
      
      // Simple examples
      if (code.includes("2 + 2")) return "4";
      if (code.includes("5 * 10")) return "50";
      if (code.includes("Hello")) return "Hello World";
      
      return "Code executed successfully";
    } catch (error) {
      throw new Error("C++ execution error");
    }
  }

  // Run test cases for a given task
  async runTestCases(language: Language, code: string, testCases: { id: string; input: string; expectedOutput: string }[]): Promise<TestCaseResult[]> {
    const results: TestCaseResult[] = [];

    for (const testCase of testCases) {
      try {
        const result = await this.executeCode(language, code, testCase.input);
        const passed = result.output.trim() === testCase.expectedOutput.trim();
        
        results.push({
          testCaseId: testCase.id,
          passed,
          actualOutput: result.output,
          error: result.error,
          executionTime: result.executionTime
        });
      } catch (error) {
        results.push({
          testCaseId: testCase.id,
          passed: false,
          actualOutput: "",
          error: error instanceof Error ? error.message : "Unknown error",
          executionTime: 0
        });
      }
    }

    return results;
  }

  // Calculate score based on test results
  calculateScore(testResults: TestCaseResult[], maxScore: number = 100): number {
    if (testResults.length === 0) return 0;
    
    const passedTests = testResults.filter(result => result.passed).length;
    const scorePerTest = maxScore / testResults.length;
    
    return Math.round(passedTests * scorePerTest);
  }
}

export const codeExecutor = new CodeExecutor();
