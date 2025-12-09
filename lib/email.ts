export async function sendEmail(to: string, subject: string, html: string) {
  // Mock SendGrid implementation
  // In production, this would use @sendgrid/mail
  console.log(`
========== MOCK EMAIL SENT ==========
To: ${to}
Subject: ${subject}
-------------------------------------
${html.replace(/<[^>]*>?/gm, '')}
=====================================
  `);
  
  return { success: true };
}
