using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Syncfusion.EJ2.DocumentEditor;

namespace DocumentPermissionsSample.Controllers;

[ApiController]
[Route("api/documents")]
public sealed class DocumentsController(IWebHostEnvironment environment, ILogger<DocumentsController> logger)
    : ControllerBase
{
    [HttpGet("template")]
    public IActionResult GetTemplate()
    {
        string path = GetTemplatePath();
        if (!System.IO.File.Exists(path))
        {
            logger.LogError("Sample template was not found.");
            return NotFound("The sample document template is missing.");
        }

        return PhysicalFile(
            path,
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "DynamicPermissionsTemplate.docx");
    }

    [HttpGet("template/sfdt")]
    public IActionResult GetTemplateSfdt()
    {
        string path = GetTemplatePath();
        if (!System.IO.File.Exists(path))
        {
            logger.LogError("Sample template was not found.");
            return NotFound("The sample document template is missing.");
        }

        try
        {
            using FileStream stream = System.IO.File.OpenRead(path);
            WordDocument document = WordDocument.Load(stream, FormatType.Docx);
            string json = JsonConvert.SerializeObject(document);
            document.Dispose();
            return Content(json, "application/json");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to convert the sample template to SFDT.");
            return StatusCode(StatusCodes.Status500InternalServerError, "The sample template could not be loaded.");
        }
    }

    private string GetTemplatePath()
    {
        return Path.Combine(environment.ContentRootPath, "Samples", "DynamicPermissionsTemplate.docx");
    }
}
