using MailKit.Security;
using Microsoft.Extensions.Configuration;
using MimeKit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HibaVonal.Services.Implementations
{
    

    public class EmailSender
    {
        private readonly string smtpServer;
        private readonly int smtpPort;
        private readonly string smtpUsername;
        private readonly string smtpPassword;

        //Set SMTP data from appsettings.json
        public EmailSender(IConfiguration configuration)
        {
            smtpServer = configuration["SMTPdata:Host"];
            smtpPort = int.Parse(configuration["SMTPdata:Port"]);
            smtpUsername = configuration["SMTPdata:Username"];
            smtpPassword = configuration["SMTPdata:Password"];
        }

        //actually send the email
        public void sendEmail(string recipientName, string recipientEmail, string subject, string body)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("HibaVonal Rendszer", "system@hibavonal.rocks"));
            message.To.Add(new MailboxAddress(recipientName, recipientEmail));
            message.Subject = subject;
            message.Body = new TextPart("plain")
            {
                Text = body
            };

            using var client = new MailKit.Net.Smtp.SmtpClient();

            client.ServerCertificateValidationCallback = (s, c, h, e) => true;

            client.Connect(smtpServer, smtpPort, SecureSocketOptions.StartTls);

            client.Authenticate(smtpUsername, smtpPassword);

            try
            {
                var result = client.Send(message);
                Console.WriteLine($"Email sent successfully to {recipientEmail}, {result}");
                client.Disconnect(true);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }

        }
    }
}