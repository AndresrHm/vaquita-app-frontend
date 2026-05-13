/* eslint-disable no-undef */
import { useRef, useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import FieldWrapper from './FieldWrapper'
import { Plus, X, FileText } from 'lucide-react'
import type { ExpenseAttachment } from '@/domain/smartScanDTO'

type Props = {
    attachments: ExpenseAttachment[]
    onAdd: (event: React.ChangeEvent<HTMLInputElement>) => void
    onRemove: (id: string) => void
}

export default function ExpenseAttachmentsField({
    attachments,
    onAdd,
    onRemove
}: Props) {

    const attachmentInputRef = useRef<HTMLInputElement>(null)

    const [selectedImage, setSelectedImage] = useState<string | null>(null)

    return (
        <>
            <FieldWrapper
                label="Comprobantes"
                instruction="Agregá fotos o tickets del gasto"
            >
                <div className="space-y-4">

                    <div className="grid grid-cols-3 gap-3">

                        {attachments.map((attachment) => {

                            const isPdf =
                                attachment.file.type === 'application/pdf'

                            return (
                                <div
                                    key={attachment.id}
                                    className="
                                        group
                                        relative
                                        aspect-square
                                        overflow-hidden
                                        rounded-2xl
                                        border
                                        border-blue-100
                                        bg-white
                                        shadow-sm
                                    "
                                >

                                    {/* PDF */}
                                    {isPdf ? (
                                        <div className="
                                            flex
                                            h-full
                                            w-full
                                            flex-col
                                            items-center
                                            justify-center
                                            gap-2
                                            bg-linear-to-br
                                            from-blue-50
                                            to-white
                                        ">
                                            <FileText className="h-10 w-10 text-blue-500" />

                                            <span className="
                                                px-2
                                                text-center
                                                text-[11px]
                                                font-medium
                                                text-muted-foreground
                                                line-clamp-2
                                            ">
                                                {attachment.file.name}
                                            </span>
                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            className="h-full w-full"
                                            onClick={() =>
                                                setSelectedImage(
                                                    attachment.preview
                                                )
                                            }
                                        >
                                            <img
                                                src={attachment.preview}
                                                alt="attachment"
                                                className="
                                                    h-full
                                                    w-full
                                                    object-cover
                                                    transition-transform
                                                    duration-300
                                                    group-hover:scale-105
                                                "
                                            />
                                        </button>
                                    )}

                                    {/* REMOVE BUTTON */}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            onRemove(attachment.id)
                                        }
                                        className="
                                            absolute
                                            right-2
                                            top-2
                                            flex
                                            h-7
                                            w-7
                                            items-center
                                            justify-center
                                            rounded-full
                                            bg-white
                                            shadow-md
                                            backdrop-blur
                                            transition
                                            hover:scale-105
                                        "
                                    >
                                        <X className="h-4 w-4 text-red-500" />
                                    </button>
                                </div>
                            )
                        })}

                        {/* ADD BUTTON */}
                        <button
                            type="button"
                            onClick={() =>
                                attachmentInputRef.current?.click()
                            }
                            className="
                                flex
                                aspect-square
                                items-center
                                justify-center
                                rounded-2xl
                                border-2
                                border-dashed
                                border-blue-200
                                bg-blue-50/70
                                transition-all
                                hover:bg-blue-100
                                active:scale-[0.98]
                            "
                        >
                            <Plus className="h-8 w-8 text-blue-500" />
                        </button>
                    </div>

                    <input
                        ref={attachmentInputRef}
                        type="file"
                        multiple
                        accept="image/*,application/pdf"
                        className="hidden"
                        onChange={onAdd}
                    />
                </div>
            </FieldWrapper>

            {/* FULLSCREEN PREVIEW */}
            <Dialog
                open={!!selectedImage}
                onOpenChange={() => setSelectedImage(null)}
            >
                <DialogContent className="
                    max-w-5xl
                    border-0
                    bg-background
                    p-2
                    shadow-none
                ">
                    {selectedImage && (
                        <img
                            src={selectedImage}
                            alt="preview"
                            className="
                                max-h-[85vh]
                                w-full
                                rounded-xl
                                object-contain
                            "
                        />
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}