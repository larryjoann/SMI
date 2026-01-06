using System.Threading.Tasks;

namespace api_SMI.Services
{
    public interface IEmailService
    {
        void SendEmail(string toAddress, string subject, string body, bool isHtml = false);
    }
}
