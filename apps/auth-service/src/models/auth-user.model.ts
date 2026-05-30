import mongoose, { Schema, type Document } from "mongoose";
import * as bcrypt from "bcrypt";
import type { IAuthUser, UserRole } from "@servora/shared-types";

export interface IAuthUserDocument extends Omit<IAuthUser, "_id">, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const authUserSchema = new Schema<IAuthUserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    role: {
      type: String,
      enum: ["customer", "worker", "admin"] as UserRole[],
      default: "customer",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
authUserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
authUserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
authUserSchema.set("toJSON", {
  transform(_doc, ret) {
    const output = ret as any;
    delete output.password;
    delete output.refreshToken;
    return output;
  },
});

export const AuthUser = mongoose.model<IAuthUserDocument>("AuthUser", authUserSchema);
