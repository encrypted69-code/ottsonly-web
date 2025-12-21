"""
OTTSONLY Backend - Installation Test Script
Run this to verify your setup is correct
"""
import sys

def test_python_version():
    """Check Python version"""
    print("🐍 Checking Python version...")
    version = sys.version_info
    if version.major >= 3 and version.minor >= 11:
        print(f"   ✅ Python {version.major}.{version.minor}.{version.micro}")
        return True
    else:
        print(f"   ❌ Python {version.major}.{version.minor}.{version.micro} (Need 3.11+)")
        return False

def test_imports():
    """Test if all required packages can be imported"""
    print("\n📦 Checking dependencies...")
    
    packages = [
        ("fastapi", "FastAPI"),
        ("uvicorn", "Uvicorn"),
        ("motor", "Motor (MongoDB driver)"),
        ("pydantic", "Pydantic"),
        ("jose", "Python-JOSE (JWT)"),
        ("razorpay", "Razorpay"),
        ("telegram", "Python Telegram Bot"),
    ]
    
    all_ok = True
    for package, name in packages:
        try:
            __import__(package)
            print(f"   ✅ {name}")
        except ImportError:
            print(f"   ❌ {name} - Not installed")
            all_ok = False
    
    return all_ok

def test_env_file():
    """Check if .env file exists"""
    print("\n⚙️  Checking configuration...")
    import os
    
    if os.path.exists(".env"):
        print("   ✅ .env file found")
        
        # Check critical variables
        from dotenv import load_dotenv
        load_dotenv()
        
        required_vars = [
            "MONGODB_URL",
            "SECRET_KEY",
            "RAZORPAY_KEY_ID",
            "RAZORPAY_KEY_SECRET"
        ]
        
        all_set = True
        for var in required_vars:
            value = os.getenv(var)
            if value and value != f"your_{var.lower()}":
                print(f"   ✅ {var} configured")
            else:
                print(f"   ⚠️  {var} needs configuration")
                all_set = False
        
        return all_set
    else:
        print("   ❌ .env file not found")
        return False

def test_mongodb():
    """Test MongoDB connection"""
    print("\n🗄️  Testing MongoDB connection...")
    try:
        from motor.motor_asyncio import AsyncIOMotorClient
        import asyncio
        import os
        from dotenv import load_dotenv
        
        load_dotenv()
        mongodb_url = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
        
        async def check_connection():
            try:
                client = AsyncIOMotorClient(mongodb_url, serverSelectionTimeoutMS=3000)
                await client.server_info()
                client.close()
                return True
            except Exception as e:
                print(f"   ❌ MongoDB connection failed: {e}")
                return False
        
        result = asyncio.run(check_connection())
        if result:
            print("   ✅ MongoDB connected successfully")
        return result
    except Exception as e:
        print(f"   ❌ Error testing MongoDB: {e}")
        return False

def test_app_import():
    """Test if the FastAPI app can be imported"""
    print("\n🚀 Testing application import...")
    try:
        from main import app
        print("   ✅ FastAPI application imported successfully")
        return True
    except Exception as e:
        print(f"   ❌ Failed to import application: {e}")
        return False

def main():
    """Run all tests"""
    print("="*60)
    print("OTTSONLY Backend - Installation Test")
    print("="*60)
    
    results = {
        "Python Version": test_python_version(),
        "Dependencies": test_imports(),
        "Configuration": test_env_file(),
        "MongoDB": test_mongodb(),
        "Application": test_app_import(),
    }
    
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)
    
    for test_name, passed in results.items():
        status = "✅ PASSED" if passed else "❌ FAILED"
        print(f"{test_name:20} {status}")
    
    print("="*60)
    
    if all(results.values()):
        print("\n🎉 All tests passed! You're ready to start the server.")
        print("\nRun: python main.py")
    else:
        print("\n⚠️  Some tests failed. Please fix the issues above.")
        print("\nSee QUICKSTART.md for setup instructions.")
    
    return all(results.values())

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
