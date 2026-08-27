namespace DocumentPermissionsSample.Models;

public sealed class DocumentPermissionResponse
{
    public required string UserId { get; init; }

    public required string Identity { get; init; }

    public required string DisplayName { get; init; }

    public required string Role { get; init; }

    public required IReadOnlyList<string> EditableBookmarks { get; init; }

    public required DateTimeOffset IssuedAtUtc { get; init; }
}
