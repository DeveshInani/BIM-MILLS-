from fastapi_mail import FastMail, MessageSchema, MessageType
from backend.email.email_config import email_conf


async def send_user_email(to_email: str, html_content: str):
    message = MessageSchema(
        subject="✅ Enquiry Submitted Successfully | BIM Mills",
        recipients=[to_email],
        body=html_content,
        subtype=MessageType.html,
    )

    fm = FastMail(email_conf)
    await fm.send_message(message)


async def send_order_confirmation(to_email: str, html_content: str):
    message = MessageSchema(
        subject="✅ Order Received Successfully | BIM Mills",
        recipients=[to_email],
        body=html_content,
        subtype=MessageType.html,
    )

    fm = FastMail(email_conf)
    await fm.send_message(message)


async def send_cancellation_confirmation(to_email: str, html_content: str):
    message = MessageSchema(
        subject="✅ Order Cancelled Successfully | BIM Mills",
        recipients=[to_email],
        body=html_content,
        subtype=MessageType.html,
    )

    fm = FastMail(email_conf)
    await fm.send_message(message)



async def send_admin_email(to_email: str, html_content: str):
    message = MessageSchema(
        subject="📩 New Enquiry Received | BIM Mills",
        recipients=[to_email],
        body=html_content,
        subtype=MessageType.html,
    )

    fm = FastMail(email_conf)
    await fm.send_message(message)


async def send_custom_email(to_email: str, subject: str, html_content: str):
    message = MessageSchema(
        subject=subject,
        recipients=[to_email],
        body=html_content,
        subtype=MessageType.html,
    )

    fm = FastMail(email_conf)
    await fm.send_message(message)
