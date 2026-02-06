"""
密码哈希生成脚本
使用此脚本生成正确的 bcrypt 密码哈希

运行方式：python generate_password_hash.py
"""
import bcrypt

def generate_hash(password: str) -> str:
    """使用 bcrypt 生成密码哈希"""
    # 使用 bcrypt 的 hashpw 函数
    password_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt(rounds=12)
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode('utf-8')

if __name__ == "__main__":
    # 生成 "123456" 的哈希
    password = "123456"
    hashed = generate_hash(password)
    print(f"Password: {password}")
    print(f"Bcrypt Hash: {hashed}")
    print()
    print("SQL Update Statement:")
    print(f"UPDATE users SET password_hash = '{hashed}' WHERE student_id LIKE 'TEST%';")
