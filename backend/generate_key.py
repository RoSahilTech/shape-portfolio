#!/usr/bin/env python3
"""
Simple script to generate a secure secret key for Flask application
"""
import secrets

def generate_secret_key():
    """Generate a cryptographically secure random key"""
    key = secrets.token_urlsafe(32)
    return key

if __name__ == '__main__':
    secret_key = generate_secret_key()
    print("\n" + "="*60)
    print("Generated Secret Key:")
    print("="*60)
    print(f"SECRET_KEY={secret_key}")
    print("="*60)
    print("\nCopy this line to your .env file!")
    print("\n")
