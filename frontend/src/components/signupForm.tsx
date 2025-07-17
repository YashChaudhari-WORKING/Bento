"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  signupFormData,
  signupSchema,
} from "@/validation/schema/auth/signupSchema";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "@/redux/features/auth/authThunks";
import type { AppDispatch } from "@/redux/store";
import { RootState } from "@/redux/store";
const SignupForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<signupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);
  const onSubmit = (data: signupFormData) => {
    dispatch(signup(data));
  };
  console.log(auth);

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="">Name :</label>
          <input type="text" {...register("name")} />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="">Email :</label>
          <input type="email" {...register("email")} />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="">Password :</label>
          <input type="text" {...register("password")} />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default SignupForm;
