import { DataTypes, Model, Optional } from "sequelize";

import Employee from "./Tbl_Employee";
import Task from "./Tbl_Task";
import Role from "./Tbl_Role";
import sequelizeConnection from "../config";

interface TaskDetailsAttributes {
  Task_details_Id: number;
  Emp_Id: number;
  Task_Id: number;
  Status: string;
  Start_Date: Date;
  Start_Time: string;
  AmPm: string;
  End_Date?: Date;
  End_Time?: string;
  Extend_Start_Date?: Date;
  Extend_Start_Time?: string;
  Extend_End_Date?: Date;
  Extend_End_Time?: string;
  Remarks?: string;
  Modified_By?: string;
  Modified_DateTime?: Date;
  Role_Id: number;
  Assigned_Emp_Id: number;
  Is_deleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TaskDetailsInput extends Optional<TaskDetailsAttributes, "Task_details_Id"> {}
export interface TaskDetailsOutput extends Required<TaskDetailsAttributes> {}

class TaskDetails extends Model<TaskDetailsAttributes, TaskDetailsInput> implements TaskDetailsAttributes {
  public Task_details_Id!: number;
  public Emp_Id!: number;
  public Task_Id!: number;
  public Status!: string;
  public Start_Date!: Date;
  public Start_Time!: string;
  public AmPm!: string;
  public End_Date?: Date;
  public End_Time?: string;
  public Extend_Start_Date?: Date;
  public Extend_Start_Time?: string;
  public Extend_End_Date?: Date;
  public Extend_End_Time?: string;
  public Remarks?: string;
  public Modified_By?: string;
  public Modified_DateTime?: Date;
  public Role_Id!: number;
  public Assigned_Emp_Id!: number;
  public Is_deleted!: boolean;
}

TaskDetails.init(
  {
    Task_details_Id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    Emp_Id: {
      type: DataTypes.INTEGER.UNSIGNED,
      references: {
        model: Employee,
        key: "Emp_Id",
      },
    },
    Task_Id: {
      type: DataTypes.INTEGER.UNSIGNED,
      references: {
        model: Task,
        key: "Task_Id",
      },
    },
    Status: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    Start_Date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    Start_Time: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    AmPm: {
      type: DataTypes.STRING(2),
      allowNull: false,
    },
    End_Date: {
      type: DataTypes.DATE,
    },
    End_Time: {
      type: DataTypes.STRING(50),
    },
    Extend_Start_Date: {
      type: DataTypes.DATE,
    },
    Extend_Start_Time: {
      type: DataTypes.STRING(50),
    },
    Extend_End_Date: {
      type: DataTypes.DATE,
    },
    Extend_End_Time: {
      type: DataTypes.STRING(50),
    },
    Remarks: {
      type: DataTypes.STRING(255),
    },
    Modified_By: {
      type: DataTypes.STRING(50),
    },
    Modified_DateTime: {
      type: DataTypes.DATE,
    },
    Role_Id: {
      type: DataTypes.INTEGER.UNSIGNED,
      references: {
        model: Role,
        key: "Role_Id",
      },
    },
    Assigned_Emp_Id: {
      type: DataTypes.INTEGER.UNSIGNED,
    },
    Is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize: sequelizeConnection,
    tableName: "Tbl_TaskDetails",
    timestamps: true,
  }
);

export default TaskDetails;