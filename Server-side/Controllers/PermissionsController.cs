using DocumentPermissionsSample.Models;
using DocumentPermissionsSample.Services;
using Microsoft.AspNetCore.Mvc;

namespace DocumentPermissionsSample.Controllers;

[ApiController]
[Route("api/permissions")]
public sealed class PermissionsController(PermissionCatalog catalog, ILogger<PermissionsController> logger)
    : ControllerBase
{
    [HttpGet]
    [Produces("application/json")]
    public ActionResult<DocumentPermissionResponse> Get([FromQuery] string? profile)
    {
        var permission = catalog.GetPermission(profile);
        logger.LogInformation(
            "Issued permission decision for requested profile {RequestedProfile} as user {UserId} with role {Role} and {BookmarkCount} editable bookmarks.",
            profile ?? string.Empty,
            permission.UserId,
            permission.Role,
            permission.EditableBookmarks.Count);
        return Ok(permission);
    }
}
