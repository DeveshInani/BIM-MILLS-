from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class Hash:
    @staticmethod
    def hash(password: str) -> str:
        """Hashes the password using bcrypt."""
        return pwd_context.hash(password)

    @staticmethod
    def verify(hashed_password: str, plain_password: str) -> bool:
        """Verifies if the plain password matches the hashed one."""
        return pwd_context.verify(plain_password, hashed_password)
