using DocumentPermissionsSample.Models;

namespace DocumentPermissionsSample.Services;

public sealed class PermissionCatalog(TimeProvider timeProvider)
{
    public DocumentPermissionResponse GetPermission(string? profile)
    {
        var issuedAtUtc = timeProvider.GetUtcNow();
        var normalized = (profile ?? string.Empty).Trim().ToLowerInvariant();

        return normalized switch
        {
            "author" => Create(
                userId: "author-001",
                identity: "Author",
                displayName: "Demo Author",
                role: "Author",
                editableBookmarks: ["ExecutiveSummary", "FinancialDetails"],
                issuedAtUtc: issuedAtUtc),
            "reviewer" => Create(
                userId: "reviewer-001",
                identity: "Reviewer",
                displayName: "Demo Reviewer",
                role: "Reviewer",
                editableBookmarks: ["ReviewerComments"],
                issuedAtUtc: issuedAtUtc),
            "viewer" => Create(
                userId: "viewer-001",
                identity: "Viewer",
                displayName: "Demo Viewer",
                role: "Viewer",
                editableBookmarks: [],
                issuedAtUtc: issuedAtUtc),
            _ => Create(
                userId: "unknown",
                identity: "Unknown",
                displayName: "Unauthorized profile",
                role: "Unknown",
                editableBookmarks: [],
                issuedAtUtc: issuedAtUtc),
        };
    }

    private static DocumentPermissionResponse Create(
        string userId,
        string identity,
        string displayName,
        string role,
        IReadOnlyList<string> editableBookmarks,
        DateTimeOffset issuedAtUtc)
    {
        return new DocumentPermissionResponse
        {
            UserId = userId,
            Identity = identity,
            DisplayName = displayName,
            Role = role,
            EditableBookmarks = editableBookmarks,
            IssuedAtUtc = issuedAtUtc,
        };
    }
}
