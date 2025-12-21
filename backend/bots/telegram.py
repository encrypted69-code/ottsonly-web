"""
Telegram Bot integration for admin notifications
"""
import asyncio
from telegram import Bot
from telegram.error import TelegramError
from core.config import settings


class TelegramBotService:
    """Telegram bot service for sending admin notifications"""
    
    def __init__(self):
        self.bot = None
        self.admin_chat_id = settings.TELEGRAM_ADMIN_CHAT_ID
        
        try:
            self.bot = Bot(token=settings.TELEGRAM_BOT_TOKEN)
        except Exception as e:
            print(f"Warning: Telegram bot initialization failed: {e}")
    
    async def send_message(self, message: str) -> bool:
        """
        Send message to admin via Telegram
        """
        if not self.bot:
            print("Telegram bot not initialized")
            return False
        
        try:
            await self.bot.send_message(
                chat_id=self.admin_chat_id,
                text=message,
                parse_mode="HTML"
            )
            return True
        except TelegramError as e:
            print(f"Failed to send Telegram message: {e}")
            return False
        except Exception as e:
            print(f"Unexpected error sending Telegram message: {e}")
            return False
    
    async def notify_new_order(self, order_data: dict):
        """Notify admin about new order"""
        message = f"""
🛒 <b>New Order Received</b>

Order ID: {order_data.get('order_id')}
User ID: {order_data.get('user_id')}
Product: {order_data.get('product_name')}
Amount: ₹{order_data.get('amount')}
Status: {order_data.get('status')}
Time: {order_data.get('created_at')}
"""
        await self.send_message(message.strip())
    
    async def notify_payment_success(self, payment_data: dict):
        """Notify admin about successful payment"""
        message = f"""
💰 <b>Payment Successful</b>

Order ID: {payment_data.get('order_id')}
User ID: {payment_data.get('user_id')}
Amount: ₹{payment_data.get('amount')}
Payment ID: {payment_data.get('payment_id')}
Time: {payment_data.get('paid_at')}
"""
        await self.send_message(message.strip())
    
    async def notify_subscription_activated(self, subscription_data: dict):
        """Notify admin about subscription activation"""
        message = f"""
✅ <b>Subscription Activated</b>

Subscription ID: {subscription_data.get('subscription_id')}
User ID: {subscription_data.get('user_id')}
Platform: {subscription_data.get('platform_name')}
Plan: {subscription_data.get('plan_name')}
Duration: {subscription_data.get('duration_days')} days
Valid Until: {subscription_data.get('end_date')}

⚠️ <i>Please assign credentials to the user.</i>
"""
        await self.send_message(message.strip())
    
    async def notify_refund_issued(self, refund_data: dict):
        """Notify admin about refund"""
        message = f"""
🔄 <b>Refund Issued</b>

Order ID: {refund_data.get('order_id')}
User ID: {refund_data.get('user_id')}
Amount: ₹{refund_data.get('amount')}
Reason: {refund_data.get('reason', 'Not specified')}
Time: {refund_data.get('refunded_at')}
"""
        await self.send_message(message.strip())
    
    async def notify_wallet_recharge(self, wallet_data: dict):
        """Notify admin about wallet recharge"""
        message = f"""
💳 <b>Wallet Recharged</b>

User ID: {wallet_data.get('user_id')}
Amount: ₹{wallet_data.get('amount')}
New Balance: ₹{wallet_data.get('new_balance')}
Payment ID: {wallet_data.get('payment_id')}
Time: {wallet_data.get('created_at')}
"""
        await self.send_message(message.strip())
    
    async def notify_low_stock(self, product_data: dict):
        """Notify admin about low stock"""
        message = f"""
⚠️ <b>Low Stock Alert</b>

Product: {product_data.get('product_name')}
Platform: {product_data.get('platform_name')}
Current Stock: {product_data.get('stock')}
Price: ₹{product_data.get('price')}

Please restock this product.
"""
        await self.send_message(message.strip())


# Global instance
telegram_service = TelegramBotService()
