# React Document Editor dynamic permissions sample

This repository is a runnable sample for Syncfusion React Docx Editor. It shows how a React application can:

1. Load a clean DOCX template from a self-hosted ASP.NET Core service.
2. Retrieve a demo identity and bookmark list from a mock permission API.
3. Mark matching bookmarked ranges as editable.
4. Protect the rest of the document as read-only.
5. Export a protected DOCX that retains those editing restrictions.


## Prerequisites

- Node.js 20 or later
- .NET 10 SDK
- A current Chromium-based browser (Chrome or Microsoft Edge)

A Syncfusion license key is optional. Without `VITE_SYNCFUSION_LICENSE` and `SYNCFUSION_LICENSE`, the editor may show a license banner. Do not commit license keys.

## Repository layout

```text
client/     React + TypeScript sample
server/     ASP.NET Core Document Editor and permission API
```

## Run the sample

Start the API:

```bash
cd server
dotnet restore
dotnet run
```

The API listens on `http://localhost:5000`.

In a second terminal, start the React app:

```bash
cd client
npm ci
npm run dev
```

Open `http://localhost:5173`. Vite proxies `/api` to the self-hosted service. The sample does **not** use Syncfusion's public demo service URL.

### Build and test

Frontend:

```bash
cd client
npm ci
npm run dev
npm run build
npm test -- --run
npm run lint
```

Backend:

```bash
cd server
dotnet restore
dotnet run
dotnet test
dotnet publish -c Release
```

## Demo profiles

| Profile | `currentUser` identity | Editable bookmarks |
| --- | --- | --- |
| Author | `Author` | `ExecutiveSummary`, `FinancialDetails` |
| Reviewer | `Reviewer` | `ReviewerComments` |
| Viewer | `Viewer` | none |

Changing the profile reloads the original unprotected template, fetches the new permission response, recreates editable regions, and reapplies read-only protection. The application does not edit permission ranges on an already-protected document.

## Permission contract

`GET /api/permissions?profile=Reviewer`

```json
{
  "userId": "reviewer-001",
  "identity": "Reviewer",
  "displayName": "Demo Reviewer",
  "role": "Reviewer",
  "editableBookmarks": ["ReviewerComments"],
  "issuedAtUtc": "2026-08-26T00:00:00Z"
}
```

Unknown or unauthorized profiles return zero editable bookmarks and `role: "Unknown"`. The UI treats that as view-only access.

## Architecture

The sample keeps three concerns separate:

- **Authentication/authorization** belongs to the backend. This sample only mocks a permission lookup.
- **Permission-to-bookmark mapping** is returned by `/api/permissions`.
- **Editing restrictions** are applied in the React Document Editor with `currentUser`, `selectBookmark()`, `insertEditingRegion()`, and `enforceProtection(..., "ReadOnly")`.

See [docs/architecture.md](docs/architecture.md) for the runtime flow.

## Sample document

`server/Samples/DynamicPermissionsTemplate.docx` is a redistributable template created for this sample. It contains:

- `ExecutiveSummary`
- `FinancialDetails`
- `ReviewerComments`


## Documentation

- [Restrict editing in React Document Editor](https://help.syncfusion.com/document-processing/word/word-processor/react/restrict-editing)
- [Bookmarks](https://help.syncfusion.com/document-processing/word/word-processor/react/bookmark)
