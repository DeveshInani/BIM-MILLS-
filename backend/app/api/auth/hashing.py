import bcrypt

class Hash:
    @staticmethod
    def hash(password: str) -> str:
        """Hashes the password using bcrypt."""
        # bcrypt.hashpw requires bytes
        pwd_bytes = password.encode('utf-8')
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(pwd_bytes, salt)
        # Return string for storage
        return hashed.decode('utf-8')

    @staticmethod
    def verify(hashed_password: str, plain_password: str) -> bool:
        """Verifies if the plain password matches the hashed one."""
        # bcrypt.checkpw requires bytes
        pwd_bytes = plain_password.encode('utf-8')
        hashed_bytes = hashed_password.encode('utf-8')
        try:
            return bcrypt.checkpw(pwd_bytes, hashed_bytes)
        except Exception:
            return False
