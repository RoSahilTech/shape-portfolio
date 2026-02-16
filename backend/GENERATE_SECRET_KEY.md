# How to Generate a Secret Key

## Method 1: Using Python (Recommended)

### Quick One-Line Command:
```bash
python -c "import secrets; print('SECRET_KEY=' + secrets.token_urlsafe(32))"
```

### Or use this script:
```python
import secrets
print(secrets.token_urlsafe(32))
```

## Method 2: Using Python Script

Create a file `generate_key.py`:
```python
import secrets

# Generate a secure random key
secret_key = secrets.token_urlsafe(32)
print(f"SECRET_KEY={secret_key}")
```

Run it:
```bash
python generate_key.py
```

## Method 3: Using OpenSSL (if installed)

```bash
openssl rand -hex 32
```

## Method 4: Using PowerShell (Windows)

```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | % {[char]$_})
```

## Method 5: Online Generator

Visit: https://randomkeygen.com/
- Use "CodeIgniter Encryption Keys" or "Fort Knox Passwords"

## Method 6: Using Python Interactive Shell

```bash
python
>>> import secrets
>>> secrets.token_urlsafe(32)
'your-generated-key-here'
>>> exit()
```

## What Makes a Good Secret Key?

- **Length**: At least 32 characters (64+ is better)
- **Randomness**: Use cryptographically secure random generators
- **Uniqueness**: Never reuse the same key
- **Secrecy**: Never commit to Git or share publicly

## Your Generated Key:

Copy this to your `.env` file:
```
SECRET_KEY=icT1SdglZC9xzi_HOzLMj4NfkREZO33Kg2QIXzgHdRw
```

## Quick Update Script

To automatically update your .env file with a new key:

**Windows PowerShell:**
```powershell
$key = python -c "import secrets; print(secrets.token_urlsafe(32))"
(Get-Content .env) -replace 'SECRET_KEY=.*', "SECRET_KEY=$key" | Set-Content .env
```

**Mac/Linux:**
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))" | sed "s/^/SECRET_KEY=/" >> .env
```
