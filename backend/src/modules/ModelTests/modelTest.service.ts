import httpStatus from "http-status";
import { IModelTest } from "./modelTest.interface";
import { ModelTest } from "./modelTest.model";
import AppError from "../../error/AppError";

const createModelTest = async (payload: IModelTest) => {
  const existing = await ModelTest.findOne({
    slug: payload.slug,
  });

  if (existing) {
    throw new AppError(httpStatus.CONFLICT, "Model test already exists.");
  }

  return await ModelTest.create(payload);
};

const getAllModelTests = async () => {
  return await ModelTest.find().sort({ createdAt: -1 });
};

const getSingleModelTest = async (id: string) => {
  const result = await ModelTest.findById(id).populate("questions");

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Model test not found.");
  }

  return result;
};

const updateModelTest = async (id: string, payload: Partial<IModelTest>) => {
  const exists = await ModelTest.findById(id);

  if (!exists) {
    throw new AppError(httpStatus.NOT_FOUND, "Model test not found.");
  }

  return await ModelTest.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
};

const deleteModelTest = async (id: string) => {
  const exists = await ModelTest.findById(id);

  if (!exists) {
    throw new AppError(httpStatus.NOT_FOUND, "Model test not found.");
  }

  await ModelTest.findByIdAndDelete(id);

  return null;
};

export const ModelTestService = {
  createModelTest,
  getAllModelTests,
  getSingleModelTest,
  updateModelTest,
  deleteModelTest,
};
