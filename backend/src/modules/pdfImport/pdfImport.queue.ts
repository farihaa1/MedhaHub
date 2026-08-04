// import { Queue, Worker, Job } from "bullmq";
// import IORedis from "ioredis";
// import { PdfImport } from "./pdfImport.model";
// import { PDF_IMPORT_STATUS } from "./pdfImport.constant";
// import { pdfImportService } from "./pdfImport.service";

// const connection = new IORedis(
//   process.env.REDIS_URL || "redis://127.0.0.1:6379",
//   {
//     maxRetriesPerRequest: null,
//   },
// );

// export const pdfImportQueue = new Queue("pdf-import", {
//   connection,

//   defaultJobOptions: {
//     attempts: 3,

//     removeOnComplete: 100,

//     removeOnFail: 50,

//     backoff: {
//       type: "exponential",
//       delay: 5000,
//     },
//   },
// });

// export async function enqueuePdfImport(importId: string) {
//   return pdfImportQueue.add("process", {
//     importId,
//   });
// }

// export const pdfImportWorker = new Worker(
//   "pdf-import",

//   async (job) => {
//     const { importId } = job.data;

//     const pdfImport = await PdfImport.findById(importId);

//     if (!pdfImport) {
//       throw new Error("Import not found");
//     }

//     try {
//       await pdfImportService.processImport(importId);
//     } catch (error: any) {
//       pdfImport.status = PDF_IMPORT_STATUS.FAILED;

//       pdfImport.logs.push({
//         timestamp: new Date(),

//         level: "ERROR",

//         message: error.message,
//       });

//       await pdfImport.save();

//       throw error;
//     }
//   },

//   {
//     connection,

//     concurrency: 2,
//   },
// );

// pdfImportWorker.on("completed", (job) => {
//   console.log(`PDF Import completed ${job.id}`);
// });

// pdfImportWorker.on("failed", (job, error) => {
//   console.error("PDF Import Failed", error);
// });
