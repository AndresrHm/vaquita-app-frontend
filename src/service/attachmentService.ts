/* eslint-disable no-undef */
import api from './apiToken'
import type { ExpenseAttachment } from '@/domain/smartScanDTO'
import type {
    InitUploadResponse,
    ConfirmUploadResponse
} from '@/domain/attachmentDTO'

class AttachmentService {

    async initUpload(
        expenseId: number,
        file: File
    ): Promise<InitUploadResponse> {

        const response = await api.post(
            `/api/expenses/${expenseId}/attachments/init`,
            {
                filename: file.name,
                mimeType: file.type,
                fileSizeBytes: file.size
            }
        )

        return response.data
    }

    async uploadToSignedUrl(
        uploadUrl: string,
        file: File
    ): Promise<void> {

        const response = await fetch(uploadUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': file.type
            },
            body: file
        })

        if (!response.ok) {
            throw new Error('Error subiendo archivo')
        }
    }

    async confirmUpload(
        expenseId: number,
        file: File,
        storageKey: string
    ): Promise<ConfirmUploadResponse> {

        const response = await api.post(
            `/api/expenses/${expenseId}/attachments/confirm`,
            {
                storageKey,
                filename: file.name,
                mimeType: file.type,
                fileSizeBytes: file.size
            }
        )

        return response.data
    }

    async uploadSingleAttachment(
        expenseId: number,
        attachment: ExpenseAttachment
    ) {

        // 1. INIT
        const init = await this.initUpload(
            expenseId,
            attachment.file
        )

        // 2. UPLOAD REAL
        await this.uploadToSignedUrl(
            init.uploadUrl,
            attachment.file
        )

        // 3. CONFIRM
        return this.confirmUpload(
            expenseId,
            attachment.file,
            init.storageKey
        )
    }

    async uploadAttachments(
        expenseId: number,
        attachments: ExpenseAttachment[]
    ) {

        await Promise.all(
            attachments.map(attachment =>
                this.uploadSingleAttachment(
                    expenseId,
                    attachment
                )
            )
        )
    }

    async getAttachments(expenseId: number) {
        const response = await api.get(`/api/expenses/${expenseId}/attachments`)
        return response.data as Array<{
            id: string
            filename: string
            mimeType: string
            fileSizeBytes: number
            downloadUrl: string
            createdAt: string
        }>
    }
}

export const attachmentService = new AttachmentService()