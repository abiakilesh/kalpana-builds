export const PHONE = "+918428949494";
export const PHONE_DISPLAY = "+91 84289 49494";
export const WHATSAPP_NUMBER = "918428949494";
export const EMAIL = "kpmkalpanaassociates@gmail.com";

export const buildWhatsAppLeadLink = (data: {
  name: string;
  phone: string;
  location: string;
  requirement: string;
}) => {
  const text = `New Lead:\nName: ${data.name}\nPhone: ${data.phone}\nLocation: ${data.location}\nRequirement: ${data.requirement}`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
};

export const WHATSAPP_GENERAL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi, I am interested in construction")}`;
