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
            message.From.Add(new MailboxAddress("HibaVonal Csapata", "KolHiba@noreply.com"));
            message.To.Add(new MailboxAddress(recipientName, recipientEmail));
            message.Subject = subject;
            message.Body = new TextPart("plain")
            {
                Text = body
            };

            using var client = new MailKit.Net.Smtp.SmtpClient();
            client.Connect(smtpServer, smtpPort, false);

            client.Authenticate(smtpUsername, smtpPassword);

            try
            {
                client.Send(message);
                client.Disconnect(true);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }

        }
    }
}