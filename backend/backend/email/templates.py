
def user_success_template(name):
    return f"""
    <html>
      <body style="font-family:Arial;background:#f4f6f8;padding:30px;">
        <div style="max-width:600px;margin:auto;background:white;border-radius:10px;padding:30px;">
          <h2 style="color:#1976d2;">Thank you for contacting BIM Mills!</h2>

          <p>Dear <strong>{name}</strong>,</p>

          <p>
            Your enquiry has been successfully received.
            Our team will get back to you shortly with the best possible solution.
          </p>

          <div style="margin:30px 0;padding:20px;background:#e3f2fd;border-left:5px solid #1976d2;">
            <strong>What happens next?</strong>
            <ul>
              <li>Our team reviews your requirement</li>
              <li>You’ll be contacted within 24 hours</li>
              <li>We provide tailored fabric solutions</li>
            </ul>
          </div>

          <p style="margin-top:30px;">
            Regards,<br>
            <strong>BIM Mills</strong><br>
            Premium Textile Manufacturing
          </p>
        </div>
      </body>
    </html>
    """
def admin_notification_template(data):
    return f"""
    <html>
      <body style="font-family:Arial;background:#f4f6f8;padding:30px;">
        <div style="max-width:600px;margin:auto;background:white;border-radius:10px;padding:30px;">
          <h2 style="color:#d32f2f;">New Enquiry Received</h2>

          <table style="width:100%;border-collapse:collapse;">
            <tr><td><strong>Name:</strong></td><td>{data.name}</td></tr>
            <tr><td><strong>Email:</strong></td><td>{data.email}</td></tr>
            <tr><td><strong>Phone:</strong></td><td>{data.phone}</td></tr>
            <tr><td><strong>Company:</strong></td><td>{data.company}</td></tr>
            <tr><td><strong>Message:</strong></td><td>{data.message}</td></tr>
          </table>

          <p style="margin-top:20px;color:#555;">
            Login to Admin Dashboard to take action.
          </p>
        </div>
      </body>
    </html>
    """
def order_confirmation_template(name, order_id, products, quantity, phone, address, amount):
    return f"""
    <html>
      <body style="font-family:Arial;background:#f4f6f8;padding:30px;">
        <div style="max-width:600px;margin:auto;background:white;border-radius:10px;padding:30px;">
          <div style="text-align:center;margin-bottom:30px;">
            <h2 style="color:#4caf50;">✅ Order Received Successfully!</h2>
            <p style="color:#666;">Order ID: <strong>#{order_id}</strong></p>
          </div>

          <p>Dear <strong>{name}</strong>,</p>

          <p>Thank you for placing your order with BIM Mills! Your order has been successfully received and is being processed.</p>

          <div style="margin:30px 0;padding:20px;background:#f0f8f0;border-left:5px solid #4caf50;">
            <h3 style="color:#4caf50;">Order Details</h3>
            <table style="width:100%;border-collapse:collapse;">
              <tr style="border-bottom:1px solid #ddd;padding:10px 0;">
                <td style="padding:10px;"><strong>Order ID:</strong></td>
                <td style="padding:10px;">#{order_id}</td>
              </tr>
              <tr style="border-bottom:1px solid #ddd;padding:10px 0;">
                <td style="padding:10px;"><strong>Products:</strong></td>
                <td style="padding:10px;">{products}</td>
              </tr>
              <tr style="border-bottom:1px solid #ddd;padding:10px 0;">
                <td style="padding:10px;"><strong>Total Quantity:</strong></td>
                <td style="padding:10px;">{quantity} units</td>
              </tr>
              <tr style="border-bottom:1px solid #ddd;padding:10px 0;">
                <td style="padding:10px;"><strong>Total Amount:</strong></td>
                <td style="padding:10px;"><strong>₹{amount:,.2f}</strong></td>
              </tr>
              <tr style="border-bottom:1px solid #ddd;padding:10px 0;">
                <td style="padding:10px;"><strong>Delivery Address:</strong></td>
                <td style="padding:10px;">{address}</td>
              </tr>
              <tr style="border-bottom:1px solid #ddd;padding:10px 0;">
                <td style="padding:10px;"><strong>Contact Phone:</strong></td>
                <td style="padding:10px;">{phone}</td>
              </tr>
            </table>
          </div>

          <div style="margin:30px 0;padding:20px;background:#e3f2fd;border-left:5px solid #1976d2;">
            <strong>What happens next?</strong>
            <ul>
              <li>Our sales team will review your order</li>
              <li>You'll be contacted at <strong>{phone}</strong> within 24 hours</li>
              <li>We'll provide shipping details and payment information</li>
              <li>Your order will be processed and delivered as per agreement</li>
            </ul>
          </div>

          <div style="margin:30px 0;padding:20px;background:#fff3cd;border-left:5px solid #ffc107;">
            <strong>Want to cancel this order?</strong>
            <p style="margin:10px 0;">If you need to cancel your order, click the button below:</p>
            <p style="text-align:center;margin:15px 0;">
              <a href="http://localhost:3000/cancel-order" style="background:#d32f2f;color:white;padding:12px 24px;text-decoration:none;border-radius:5px;font-weight:bold;">Cancel Order</a>
            </p>
            <p style="margin:10px 0;font-size:12px;">You'll need your Order ID (<strong>#{order_id}</strong>) and this email address to request cancellation.</p>
          </div>

          <p style="margin-top:30px;color:#666;">
            If you have any questions, please don't hesitate to contact us.<br><br>
            Regards,<br>
            <strong>BIM Mills</strong><br>
            Premium Textile Manufacturing<br>
            <em>Quality Fabrics, Reliable Service</em>
          </p>
        </div>
      </body>
    </html>
    """

def cancellation_confirmation_template(name, order_id, products, amount):
    return f"""
    <html>
      <body style="font-family:Arial;background:#f4f6f8;padding:30px;">
        <div style="max-width:600px;margin:auto;background:white;border-radius:10px;padding:30px;">
          <div style="text-align:center;margin-bottom:30px;">
            <h2 style="color:#d32f2f;">✅ Order Cancelled Successfully</h2>
            <p style="color:#666;">Order ID: <strong>#{order_id}</strong></p>
          </div>

          <p>Dear <strong>{name}</strong>,</p>

          <p>Your order has been successfully cancelled. Here are the details:</p>

          <div style="margin:30px 0;padding:20px;background:#ffe0e0;border-left:5px solid #d32f2f;">
            <h3 style="color:#d32f2f;">Cancellation Details</h3>
            <table style="width:100%;border-collapse:collapse;">
              <tr style="border-bottom:1px solid #ddd;padding:10px 0;">
                <td style="padding:10px;"><strong>Order ID:</strong></td>
                <td style="padding:10px;">#{order_id}</td>
              </tr>
              <tr style="border-bottom:1px solid #ddd;padding:10px 0;">
                <td style="padding:10px;"><strong>Products:</strong></td>
                <td style="padding:10px;">{products}</td>
              </tr>
              <tr style="border-bottom:1px solid #ddd;padding:10px 0;">
                <td style="padding:10px;"><strong>Refund Amount:</strong></td>
                <td style="padding:10px;"><strong>₹{amount:,.2f}</strong></td>
              </tr>
              <tr style="border-bottom:1px solid #ddd;padding:10px 0;">
                <td style="padding:10px;"><strong>Status:</strong></td>
                <td style="padding:10px;"><span style="color:#d32f2f;font-weight:bold;">CANCELLED</span></td>
              </tr>
            </table>
          </div>

          <div style="margin:30px 0;padding:20px;background:#e3f2fd;border-left:5px solid #1976d2;">
            <strong>What happens next?</strong>
            <ul>
              <li>Your order has been removed from our system</li>
              <li>If payment was made, refund will be processed within 5-7 business days</li>
              <li>You will receive a refund confirmation once processed</li>
              <li>If you have questions about the refund, please contact us</li>
            </ul>
          </div>

          <p style="margin-top:30px;color:#666;">
            We're sorry to see you go! If there's anything we could have done better, please let us know.<br><br>
            Regards,<br>
            <strong>BIM Mills</strong><br>
            Premium Textile Manufacturing<br>
            <em>Quality Fabrics, Reliable Service</em>
          </p>
        </div>
      </body>
    </html>
    """