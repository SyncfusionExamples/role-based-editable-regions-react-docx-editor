using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Syncfusion.EJ2.DocumentEditor;
using FormatType = Syncfusion.EJ2.DocumentEditor.FormatType;
using WDocument = Syncfusion.DocIO.DLS.WordDocument;
using WFormatType = Syncfusion.DocIO.FormatType;

namespace DocumentPermissionsSample.Controllers;

[Route("api/documenteditor")]
public sealed class DocumentEditorController(ILogger<DocumentEditorController> logger) : ControllerBase
{
    [HttpPost("Import")]
    public IActionResult Import([FromForm] IFormCollection data)
    {
        if (data.Files.Count == 0)
        {
            return BadRequest("A document file is required.");
        }

        IFormFile file = data.Files[0];
        int index = file.FileName.LastIndexOf('.');
        string type = index > -1 && index < file.FileName.Length - 1
            ? file.FileName[index..]
            : ".docx";

        using var stream = new MemoryStream();
        file.CopyTo(stream);
        stream.Position = 0;

        try
        {
            WordDocument document = WordDocument.Load(stream, GetFormatType(type.ToLowerInvariant()));
            string json = JsonConvert.SerializeObject(document);
            document.Dispose();
            return Content(json, "application/json");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Document import failed for an uploaded file of type {FileType}.", type);
            return StatusCode(StatusCodes.Status500InternalServerError, "Document import failed.");
        }
    }

    [HttpPost("SystemClipboard")]
    public IActionResult SystemClipboard([FromBody] CustomParameter? param)
    {
        if (param is null || string.IsNullOrWhiteSpace(param.Content))
        {
            return Content(string.Empty, "application/json");
        }

        try
        {
            WordDocument document = WordDocument.LoadString(param.Content, GetFormatType(param.Type?.ToLowerInvariant() ?? ".txt"));
            string json = JsonConvert.SerializeObject(document);
            document.Dispose();
            return Content(json, "application/json");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "System clipboard conversion failed.");
            return Content(string.Empty, "application/json");
        }
    }

    [HttpPost("RestrictEditing")]
    public ActionResult<string[]> RestrictEditing([FromBody] CustomRestrictParameter? param)
    {
        if (param is null || string.IsNullOrEmpty(param.PasswordBase64))
        {
            return BadRequest("A protection password is required.");
        }

        return string.IsNullOrWhiteSpace(param.AlgorithmSid)
            ? WordDocument.ComputeHash(param.PasswordBase64, param.SaltBase64 ?? string.Empty, param.SpinCount)
            : WordDocument.ComputeHash(param.PasswordBase64, param.SaltBase64 ?? string.Empty, param.SpinCount, param.AlgorithmSid);
    }

    [HttpPost("ExportSFDT")]
    public IActionResult ExportSfdt([FromBody] SaveParameter? data)
    {
        if (data is null || string.IsNullOrWhiteSpace(data.Content))
        {
            return BadRequest("Document content is required.");
        }

        string name = string.IsNullOrWhiteSpace(data.FileName) ? "Document.docx" : data.FileName;
        string format = RetrieveFileType(name);
        WDocument document = WordDocument.Save(data.Content);
        return SaveDocument(document, format, name);
    }

    [HttpPost("Export")]
    public IActionResult Export([FromForm] IFormCollection data)
    {
        if (data.Files.Count == 0)
        {
            return BadRequest("A document file is required.");
        }

        string fileName = GetValue(data, "filename");
        if (string.IsNullOrWhiteSpace(fileName))
        {
            fileName = "Document.docx";
        }

        using var stream = new MemoryStream();
        data.Files[0].CopyTo(stream);
        stream.Position = 0;
        var document = new WDocument(stream, WFormatType.Docx);
        return SaveDocument(document, RetrieveFileType(fileName), fileName);
    }

    private static FileStreamResult SaveDocument(WDocument document, string format, string fileName)
    {
        var stream = new MemoryStream();
        WFormatType type = GetWFormatType(format);
        string contentType = type switch
        {
            WFormatType.Rtf => "application/rtf",
            WFormatType.WordML => "application/xml",
            WFormatType.Html => "text/html",
            WFormatType.Dotx => "application/vnd.openxmlformats-officedocument.wordprocessingml.template",
            WFormatType.Doc => "application/msword",
            WFormatType.Dot => "application/msword",
            _ => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        };

        document.Save(stream, type);
        document.Close();
        stream.Position = 0;
        return new FileStreamResult(stream, contentType)
        {
            FileDownloadName = fileName,
        };
    }

    private static string RetrieveFileType(string name)
    {
        int index = name.LastIndexOf('.');
        return index > -1 && index < name.Length - 1 ? name[index..] : ".docx";
    }

    private static string GetValue(IFormCollection data, string key)
    {
        if (data.TryGetValue(key, out var values) && values.Count > 0)
        {
            return values[0] ?? string.Empty;
        }

        return string.Empty;
    }

    private static FormatType GetFormatType(string format)
    {
        return format switch
        {
            ".dotx" or ".docx" or ".docm" or ".dotm" => FormatType.Docx,
            ".dot" or ".doc" => FormatType.Doc,
            ".rtf" => FormatType.Rtf,
            ".txt" => FormatType.Txt,
            ".xml" => FormatType.WordML,
            ".html" => FormatType.Html,
            _ => throw new NotSupportedException("The Document Editor service does not support this file format."),
        };
    }

    private static WFormatType GetWFormatType(string format)
    {
        return format.ToLowerInvariant() switch
        {
            ".dotx" => WFormatType.Dotx,
            ".docx" => WFormatType.Docx,
            ".docm" => WFormatType.Docm,
            ".dotm" => WFormatType.Dotm,
            ".dot" => WFormatType.Dot,
            ".doc" => WFormatType.Doc,
            ".rtf" => WFormatType.Rtf,
            ".html" => WFormatType.Html,
            ".txt" => WFormatType.Txt,
            ".xml" => WFormatType.WordML,
            ".odt" => WFormatType.Odt,
            _ => throw new NotSupportedException("The Document Editor service does not support this file format."),
        };
    }

    public sealed class CustomParameter
    {
        [JsonPropertyName("content")]
        public string? Content { get; set; }

        [JsonPropertyName("type")]
        public string? Type { get; set; }
    }

    public sealed class CustomRestrictParameter
    {
        [JsonPropertyName("passwordBase64")]
        public string? PasswordBase64 { get; set; }

        [JsonPropertyName("saltBase64")]
        public string? SaltBase64 { get; set; }

        [JsonPropertyName("spinCount")]
        public int SpinCount { get; set; }

        [JsonPropertyName("algorithmSid")]
        public string? AlgorithmSid { get; set; }
    }

    public sealed class SaveParameter
    {
        [JsonPropertyName("content")]
        public string? Content { get; set; }

        [JsonPropertyName("fileName")]
        public string? FileName { get; set; }
    }
}
