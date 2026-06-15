import { QRCodeSVG } from 'qrcode.react'

export function ComponenteInvitacionQR({ idEntidad, tipo = 'grupo' }: { idEntidad: string, tipo: string }) {
    const baseUrl = window.location.origin
    const shareUrl = tipo === 'grupo'
        ? `${baseUrl}/groups/join?inviteId=${idEntidad}`
        : `${baseUrl}/friends/add?userId=${idEntidad}`

    return (
        <div className="flex flex-col items-center justify-center p-6 bg-white rounded-3xl border border-border shadow-sm max-w-sm mx-auto gap-4">
            <div className="p-4 bg-muted/30 rounded-2xl border border-border">
                <QRCodeSVG
                    value={shareUrl}
                    size={200}
                    bgColor={'#ffffff'}
                    fgColor={'#0f172a'}
                    level={'M'} // Tolerancia a daños media
                />
            </div>
            <p className="text-xs text-muted-foreground text-center px-4">
                Presentá este código QR para que otra persona lo escanee desde la app de Vaquita.
            </p>
        </div>
    )
}