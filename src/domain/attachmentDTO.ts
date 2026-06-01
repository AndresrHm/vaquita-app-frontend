export type InitUploadResponse = {
    uploadUrl: string
    storageKey: string
}

export type ConfirmUploadResponse = {
    id: string
    storageKey: string
    filename: string
    mimeType: string
    fileSizeBytes: number
    createdAt: string
}