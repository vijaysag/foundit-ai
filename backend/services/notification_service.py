import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

load_dotenv()

class NotificationService:
    def __init__(self):
        self.mail_username = os.getenv("MAIL_USERNAME")
        self.mail_password = os.getenv("MAIL_PASSWORD")
        self.mail_from = os.getenv("MAIL_FROM")
        self.mail_port = int(os.getenv("MAIL_PORT", 587))
        self.mail_server = os.getenv("MAIL_SERVER", "smtp.gmail.com")
        self.mail_from_name = os.getenv("MAIL_FROM_NAME", "FoundIt AI")

    def send_email(self, to_email: str, subject: str, body: str):
        """Sends an email notification."""
        if not all([self.mail_username, self.mail_password, self.mail_from]):
            print(f"EMAIL MOCK: To {to_email} | Subject: {subject}")
            with open("mock_emails.txt", "a", encoding="utf-8") as f:
                f.write(f"--- NEW EMAIL ---\nTo: {to_email}\nSubject: {subject}\nBody: {body}\n\n")
            return False

        try:
            msg = MIMEMultipart()
            msg['From'] = f"{self.mail_from_name} <{self.mail_from}>"
            msg['To'] = to_email
            msg['Subject'] = subject
            msg.attach(MIMEText(body, 'html'))

            server = smtplib.SMTP(self.mail_server, self.mail_port)
            server.starttls()
            server.login(self.mail_username, self.mail_password)
            server.send_message(msg)
            server.quit()
            return True
        except Exception as e:
            print(f"Error sending email: {e}")
            return False

notification_service = NotificationService()
