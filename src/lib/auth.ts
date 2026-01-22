"use client";

import { getFirebaseClient, firebaseOperations } from "@/lib/firebaseClient";
import { User } from "@/lib/types";

export const authUtils = {
  // Get current user from localStorage
  getCurrentUser: (): User | null => {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem("currentUser");
    return stored ? JSON.parse(stored) : null;
  },

  // Logout user
  logout: () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("currentUser");
    window.location.href = "/login";
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!authUtils.getCurrentUser();
  },

  // Get user role
  getUserRole: (): "faculty" | "student" | null => {
    const user = authUtils.getCurrentUser();
    return user?.role || null;
  },

  // Seed database with sample users
  seedUsers: async () => {
    const { database } = getFirebaseClient();
    if (!database) return;

    const sampleUsers: User[] = [
      {
        id: "faculty_1",
        username: "faculty",
        password: "faculty",
        role: "faculty",
        school: "STME",
        batchYear: "2nd year"
      },
      {
        id: "student_1",
        username: "student",
        password: "student",
        role: "student",
        school: "STME",
        batchYear: "2nd year"
      },
      {
        id: "faculty_2",
        username: "prof_john",
        password: "prof123",
        role: "faculty",
        school: "SOL",
        batchYear: "3rd year"
      },
      {
        id: "student_2",
        username: "alice_student",
        password: "alice123",
        role: "student",
        school: "SOL",
        batchYear: "3rd year"
      }
    ];

    try {
      await firebaseOperations.writeData("users", 
        sampleUsers.reduce((acc, user) => {
          acc[user.id] = user;
          return acc;
        }, {} as Record<string, User>)
      );
      console.log("Sample users seeded successfully");
    } catch (error) {
      console.error("Error seeding users:", error);
    }
  }
};
