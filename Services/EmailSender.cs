using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.Extensions.Options;
using SendGrid;
using SendGrid.Helpers.Mail;
using System;
using System.Threading.Tasks;

namespace TodoListWeb.Services
{
    public interface IEmailSender
    {
        Task SendEmailAsync(string email, string subject, string message, string htmlContent);
    }
    public class EmailSender : IEmailSender
    {
        public EmailSender(IOptions<AuthMessageSenderOptions> optionsAccessor)
        {
            Options = optionsAccessor.Value;
        }

        public AuthMessageSenderOptions Options { get; } //set only via Secret Manager

        public Task SendEmailAsync(string email, string subject, string message, string htmlContent)
        {
            return Execute(subject, message, email, htmlContent);
        }

        public async Task Execute(string subject, string message, string email, string htmlContent)
        {
            var apiKey = Environment.GetEnvironmentVariable("SENDGRID_KEY");
            var client = new SendGridClient(apiKey);
            var from = new EmailAddress("admin@doobido.com", "doobido");
            var to = new EmailAddress(email, "Example User");
            var msg = MailHelper.CreateSingleEmail(from, to, subject, message, htmlContent);

            var response = await client.SendEmailAsync(msg);
        }
    }
}
