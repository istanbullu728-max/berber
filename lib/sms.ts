export type SMSType = 'CONFIRMATION' | 'REMINDER' | 'REVIEW';

export const sendSMS = async (phone: string, message: string, type: SMSType) => {
    // Bu bölüm normalde Twilio, Netgsm vb. bir servis ile entegre edilecek.
    // Şimdilik konsola log basarak simüle ediyoruz.

    console.log(`--- [SMS SERVICE] ---`);
    console.log(`Kime: ${phone}`);
    console.log(`Tip: ${type}`);
    console.log(`Mesaj: ${message}`);
    console.log(`----------------------`);

    return { success: true, messageId: Math.random().toString(36).substr(2, 9) };
};

export const generateMessage = (type: SMSType, data: any) => {
    switch (type) {
        case 'CONFIRMATION':
            return `Merhaba ${data.name}, ${data.date} saat ${data.time} randevunuz onaylanmıştır. Sizi bekliyoruz!`;
        case 'REMINDER':
            return `Hatırlatma: ${data.name}, bugün saat ${data.time} randevunuz bulunmaktadır.`;
        case 'REVIEW':
            return `Bizi tercih ettiğiniz için teşekkürler ${data.name}. Hizmetimizi değerlendirmek ister misiniz? https://g.page/barbersaas/review`;
        default:
            return '';
    }
};
