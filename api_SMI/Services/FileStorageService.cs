using Microsoft.AspNetCore.Http;

namespace api_SMI.Services
{
    public class FileStorageService
    {
        private readonly string _uploadFolder;

        public FileStorageService(string uploadFolder)
        {
            _uploadFolder = uploadFolder;
        }

        public async Task<string> SaveFileAsync(IFormFile file)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("Fichier invalide");

            if (!Directory.Exists(_uploadFolder))
                Directory.CreateDirectory(_uploadFolder);

            // Générer un nom unique
            var uniqueName = $"{Path.GetFileNameWithoutExtension(file.FileName)}_{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            var filePath = Path.Combine(_uploadFolder, uniqueName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return Path.Combine("uploads", uniqueName);
        }

        public async Task<List<string>> SaveFilesAsync(List<IFormFile> files)
        {
            var chemins = new List<string>();
            foreach (var file in files)
            {
                // Générer un nom unique pour chaque fichier
                var uniqueName = $"{Path.GetFileNameWithoutExtension(file.FileName)}_{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
                var filePath = Path.Combine(_uploadFolder, uniqueName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                chemins.Add(Path.Combine("uploads", uniqueName));
            }
            return chemins;
        }
    }
}