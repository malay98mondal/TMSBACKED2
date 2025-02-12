"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Tbl_TaskDetails_1 = __importDefault(require("../db/models/Tbl_TaskDetails"));
const sequelize_1 = require("sequelize");
const authenticateMember_1 = require("../middleware/authenticateMember");
const EmploySideRoute = (0, express_1.Router)();
EmploySideRoute.get("/assigned", authenticateMember_1.authenticateMember, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const Assigned_Emp_Id = req.user.Emp_Id;
    const { page = 1, limit = 5, search = '' } = req.query; // Extract search, page, and limit from query parameters
    const offset = (parseInt(page) - 1) * parseInt(limit); // Calculate offset
    try {
        // Query the database to find all tasks assigned to the employee and exclude completed tasks
        const { count, rows: taskDetails } = yield Tbl_TaskDetails_1.default.findAndCountAll({
            where: {
                Assigned_Emp_Id: Assigned_Emp_Id,
                Is_deleted: false,
                Status: {
                    [sequelize_1.Op.ne]: 'Completed' // Sequelize 'not equal' operator to exclude completed tasks
                },
                Task_Details: {
                    [sequelize_1.Op.iLike]: `%${search}%`
                },
            },
            limit: parseInt(limit),
            offset: offset, // Set offset for pagination
        });
        // Check if tasks are found
        return res.status(200).json({
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            tasks: taskDetails,
        });
    }
    catch (error) {
        console.error("Error fetching task details:", error);
        return res.status(500).json({ message: "An error occurred while fetching task details." });
    }
}));
// EmploySideRoute.get("/CompletedTask/:Assigned_Emp_Id", async (req: Request, res: Response) => {
//   const { Assigned_Emp_Id } = req.params;
//   const search = req.query.search as string || ''; // Search term from query parameters
//   const page = parseInt(req.query.page as string) || 1; // Current page number
//   const limit = parseInt(req.query.limit as string) || 10; // Number of items per page
//   const offset = (page - 1) * limit; // Calculate offset for pagination
//   try {
//     // Query the database to find all tasks assigned to the employee that are completed
//     const taskDetails = await TaskDetails.findAndCountAll({
//       where: {
//         Assigned_Emp_Id: Assigned_Emp_Id, // Filter by Assigned_Emp_Id
//         Is_deleted: false, // Only fetch tasks that are not deleted
//         Status: 'Completed', // Only fetch completed tasks
//         ...(search && { // If a search term is provided, add the search condition
//           Task_Details: { [Op.like]: `%${search}%` }, // Assuming `Title` is the field to search
//         }),
//       },
//       limit: limit, // Limit the results per page
//       offset: offset, // Pagination offset
//     });
//     // Check if tasks are found
//     if (taskDetails.rows.length > 0) {
//       return res.status(200).json({
//         tasks: taskDetails.rows,
//         total: taskDetails.count, // Total number of matching tasks
//         totalPages: Math.ceil(taskDetails.count / limit), // Total number of pages
//         currentPage: page, // Current page
//       });
//     } else {
//       return res.status(404).json({ message: "No tasks found for the assigned employee." });
//     }
//   } catch (error) {
//     console.error("Error fetching task details:", error);
//     return res.status(500).json({ message: "An error occurred while fetching task details." });
//   }
// });
EmploySideRoute.get("/CompletedTask", authenticateMember_1.authenticateMember, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const Assigned_Emp_Id = req.user.Emp_Id;
    const { page = 1, limit = 5, search = '' } = req.query; // Extract search, page, and limit from query parameters
    const offset = (parseInt(page) - 1) * parseInt(limit); // Calculate offset
    try {
        // Query the database to find all tasks assigned to the employee and exclude completed tasks
        const { count, rows: taskDetails } = yield Tbl_TaskDetails_1.default.findAndCountAll({
            where: {
                Assigned_Emp_Id: Assigned_Emp_Id,
                Is_deleted: false,
                Status: 'Completed',
                Task_Details: {
                    [sequelize_1.Op.iLike]: `%${search}%`
                },
            },
            limit: parseInt(limit),
            offset: offset, // Set offset for pagination
        });
        // Check if tasks are found
        return res.status(200).json({
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            tasks: taskDetails,
        });
    }
    catch (error) {
        console.error("Error fetching task details:", error);
        return res.status(500).json({ message: "An error occurred while fetching task details." });
    }
}));
//update
EmploySideRoute.put('/UpdateTask/:Task_details_Id', authenticateMember_1.authenticateMember, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { Task_details_Id } = req.params;
        const { Status, Remarks, Actual_Start_Date, Actual_Start_Time } = req.body;
        const Emp_Id = req.user.Emp_Id;
        // Find the task by Task_details_Id
        const task = yield Tbl_TaskDetails_1.default.findOne({
            where: { Task_details_Id, Is_deleted: false } // Ensure that the task is not soft-deleted
        });
        if (!task) {
            return res.status(404).json({
                message: 'Task not found'
            });
        }
        // Prepare update payload
        let updatePayload = { Status };
        // Handle Actual_Start_Date and Actual_Start_Time
        if (Actual_Start_Date && Actual_Start_Time) {
            // If both are provided, use them to update the task
            updatePayload.Actual_Start_Date = Actual_Start_Date;
            updatePayload.Actual_Start_Time = Actual_Start_Time;
        }
        else {
            // If either is missing, use Start_Date and Start_Time
            updatePayload.Actual_Start_Date = task.Start_Date; // Fallback to Start_Date
            updatePayload.Actual_Start_Time = task.Start_Time; // Fallback to Start_Time
        }
        // Check if Status is 'Completed' and Remarks is not empty
        if (Status === 'Completed' && Remarks) {
            // Get current date and time
            const currentDate = new Date();
            const currentTimeString = currentDate.toTimeString().split(' ')[0].slice(0, 5); // Format as HH:mm
            // Add Extend_End_Date and Extend_End_Time to update payload
            updatePayload.Extend_End_Date = currentDate; // update Set the current date 
            updatePayload.Extend_End_Time = currentTimeString; // Set the current time
        }
        // Always update Remarks if provided
        if (Remarks) {
            updatePayload.Remarks = Remarks;
        }
        //  // Get current date and time in IST (Asia/Kolkata)
        //  const currentDateIST = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
        //  const formattedISTDate = new Date(currentDateIST); // Convert it back to a Date object
        //  // Set Modified_DateTime to current date and time in IST
        //  updatePayload.Modified_DateTime = formattedISTDate.toISOString(); // Convert to ISO format for the database
        //Set Modified_DateTime to current date and time
        updatePayload.Modified_DateTime = new Date();
        //Set Modified_By to Emp_Id
        updatePayload.Modified_By = Emp_Id;
        // Update the task
        const updatedTask = yield task.update(updatePayload);
        return res.status(200).json({
            message: 'Task updated successfully',
            task: updatedTask
        });
    }
    catch (error) {
        const errorMessage = error.message || 'Error updating task';
        console.error(error);
        return res.status(500).json({
            message: errorMessage
        });
    }
}));
exports.default = EmploySideRoute;
