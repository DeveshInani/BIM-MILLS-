import logging

from fastapi_mail import FastMail, MessageSchema, MessageType

from app.api.email.email_config import email_conf


logger = logging.getLogger(__name__)


async def _send_email(subject: str, to_email: str, html_content: str):
    if not to_email:
        logger.error("Email send skipped because recipient is missing. Subject: %s", subject)
        return

    message = MessageSchema(
        subject=subject,
        recipients=[to_email],
        body=html_content,
        subtype=MessageType.html,
    )

    try:
        fm = FastMail(email_conf)
        await fm.send_message(message)
        logger.info("Email sent to %s. Subject: %s", to_email, subject)
    except Exception:
        logger.exception("Failed to send email to %s. Subject: %s", to_email, subject)


async def send_user_email(to_email: str, html_content: str):
    await _send_email("Enquiry Submitted Successfully | BIM Mills", to_email, html_content)


async def send_order_confirmation(to_email: str, html_content: str):
    await _send_email("Order Received Successfully | BIM Mills", to_email, html_content)


async def send_cancellation_confirmation(to_email: str, html_content: str):
    await _send_email("Order Cancelled Successfully | BIM Mills", to_email, html_content)


async def send_admin_email(to_email: str, html_content: str):
    await _send_email("New Enquiry Received | BIM Mills", to_email, html_content)


async def send_custom_email(to_email: str, subject: str, html_content: str):
    await _send_email(subject, to_email, html_content)
