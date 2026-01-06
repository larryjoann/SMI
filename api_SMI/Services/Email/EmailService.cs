using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.IO;
using System.Net;
using System.Net.Mail;

namespace api_SMI.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public void SendEmail(string toAddress, string subject, string body, bool isHtml = false)
        {
            try
            {
                var smtpSection = _configuration.GetSection("Smtp");
                var host = smtpSection.GetValue<string>("Host");
                var port = smtpSection.GetValue<int?>("Port") ?? 25;
                var enableSsl = smtpSection.GetValue<bool?>("EnableSsl") ?? false;
                var username = smtpSection.GetValue<string>("Username");
                var password = smtpSection.GetValue<string>("Password");
                var from = smtpSection.GetValue<string>("From") ?? username;
                // Basic validation to avoid ArgumentNullException in MailAddress
                if (string.IsNullOrWhiteSpace(toAddress))
                {
                    var warn = $"Email not sent: recipient address is empty or null (subject: {subject}).";
                    try { _logger?.LogWarning(warn); } catch { }
                    try { Console.WriteLine(warn); } catch { }
                    return;
                }

                if (string.IsNullOrWhiteSpace(from))
                {
                    var warn = $"Email not sent: SMTP 'From' address is not configured (subject: {subject}, to: {toAddress}).";
                    try { _logger?.LogWarning(warn); } catch { }
                    try { Console.WriteLine(warn); } catch { }
                    return;
                }

                if (string.IsNullOrWhiteSpace(host))
                {
                    var warn = $"Email not sent: SMTP 'Host' is not configured. (to: {toAddress})";
                    try { _logger?.LogWarning(warn); } catch { }
                    try { Console.WriteLine(warn); } catch { }
                    return;
                }

                using var message = new MailMessage();
                message.From = new MailAddress(from);
                message.To.Add(new MailAddress(toAddress));
                message.Subject = subject;
                message.Body = body;
                message.IsBodyHtml = isHtml;

                using var client = new SmtpClient(host, port)
                {
                    EnableSsl = enableSsl,
                    DeliveryMethod = SmtpDeliveryMethod.Network
                };

                if (!string.IsNullOrEmpty(username) && !string.IsNullOrEmpty(password))
                {
                    client.Credentials = new NetworkCredential(username, password);
                }

                client.Send(message);

                // Log success to ILogger and also write to console so it appears in terminal
                var successMsg = $"Email successfully sent to {toAddress} (Subject: {subject})";
                try { _logger?.LogInformation(successMsg); } catch { }
                try { Console.WriteLine(successMsg); } catch { }
            }
            catch (Exception ex)
            {
                // Log the failure
                try { _logger?.LogWarning(ex, "Failed to send email to {to}", toAddress); } catch { }

                // Fallback: save the email to a local folder so it can be resent or inspected
                try
                {
                    var smtpSectionFallback = _configuration.GetSection("Smtp");
                    var from = smtpSectionFallback.GetValue<string>("From") ?? smtpSectionFallback.GetValue<string>("Username") ?? "no-reply@local";

                    var emailsDir = Path.Combine(AppContext.BaseDirectory, "emails");
                    if (!Directory.Exists(emailsDir)) Directory.CreateDirectory(emailsDir);

                    var fileName = $"email_{DateTime.Now:yyyyMMdd_HHmmss}_{Guid.NewGuid()}.html";
                    var filePath = Path.Combine(emailsDir, fileName);

                    using var sw = new StreamWriter(filePath);
                    sw.WriteLine("<!-- Saved email due to SMTP failure -->");
                    sw.WriteLine($"<p><strong>To:</strong> {toAddress}</p>");
                    sw.WriteLine($"<p><strong>From:</strong> {from}</p>");
                    sw.WriteLine($"<p><strong>Subject:</strong> {subject}</p>");
                    sw.WriteLine($"<p><strong>Date:</strong> {DateTime.Now}</p>");
                    sw.WriteLine("<hr/>");
                    sw.WriteLine(body ?? string.Empty);
                    sw.WriteLine("<hr/>");
                    sw.WriteLine("<pre>");
                    sw.WriteLine(ex.ToString());
                    sw.WriteLine("</pre>");
                    sw.Flush();

                    var savedMsg = $"Email saved to {filePath} due to SMTP failure.";
                    try { _logger?.LogInformation(savedMsg); } catch { }
                    try { Console.WriteLine(savedMsg); } catch { }
                }
                catch (Exception saveEx)
                {
                    try { _logger?.LogError(saveEx, "Failed to save fallback email for {to}", toAddress); } catch { }
                    try { Console.WriteLine($"Failed to save fallback email: {saveEx.Message}"); } catch { }
                }
            }
        }
    }
}
