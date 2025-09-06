"use server";

import { mkdir, writeFile } from "fs/promises";
import { extname, resolve } from "path";

type UploadImageActionResult = {
	url: string;
	error: string;
};

export async function uploadImageAction(
	formData: FormData,
): Promise<UploadImageActionResult> {
	const makeResult = ({ url = "", error = "" }) => ({
		url,
		error,
	});

	if (!(formData instanceof FormData)) {
		return makeResult({ error: "Invalid data." });
	}

	const file = formData.get("file");

	if (!(file instanceof File)) {
		return makeResult({ error: "Invalid file" });
	}

	const uploadMaxSize =
		Number(process.env.NEXT_PUBLIC_IMAGE_UPLOAD_MAX_SIZE) || 921600;
	if (file.size > uploadMaxSize) {
		return makeResult({ error: "File size exceeds limit." });
	}

	if (!file.type.startsWith("image/")) {
		return makeResult({ error: "File is not an image." });
	}

	const imageExtension = extname(file.name);
	const uniqueImageName = `image-${Date.now()}${imageExtension}`;

	const uploadDirectory = process.env.IMAGE_UPLOAD_DIRECTORY || "uploads";
	const uploadFullPath = resolve(process.cwd(), "public", uploadDirectory);
	await mkdir(uploadFullPath, { recursive: true });

	const fileArrayBuffer = await file.arrayBuffer();
	const buffer = Buffer.from(fileArrayBuffer);

	const fileFullPath = resolve(uploadFullPath, uniqueImageName);
	await writeFile(fileFullPath, buffer);

	const imageServerUrl =
		process.env.IMAGE_SERVER_URL || "http://localhost:3001/uploads";
	const url = `${imageServerUrl}/${uniqueImageName}`;

	return makeResult({
		url,
	});
}
