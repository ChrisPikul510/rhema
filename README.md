# Rhema
XML-based markdown format for tracking translation/internationalization files. Aims to unify translations into a more singular code base. From the rhema project/files, language files can be exported for JSON/JavaScript based, iOS/Mac `.strings`, and Android XML `strings.xml`.

**MASSIVELY UNDER WORK, NOT ALL FEATURES IMPLEMENTED**

## Why, or the use-case
When building an app/project for cross-platform deployment, tracking down and keeping the translations in order can be a burden. Especially if they're all in different formats. It's easy enough for a developer to read JSON or XML files, but 
getting someone outside this community to work with them can be less ideal. So I came up with this. Heavily inspired
by the XLIFF 2.0 format, but with a bit more of the "machine" feel taken out. Instead of a single file spec, I've gone for
two, which is just a project file to join together sub-files for translations. With this project, I can generate and export 
the needed files for which-ever platform I'm building for. And by keeping them together it becomes a one-stop-shop for 
the project.

### Pros
- Single-format exports to many other formats (XML, JSON, Properties, XLIFF(maybe) )
- Tracking a "base language" file fills in the blanks and notifies of errors
- Use's IDs for entries to minify the lookup
- Supports groups and sub-groups for organizing
- Platform switch can add/remove keys from being exported per the platform they target
- Dataset is provided in the file, so variable and template replacement is easier
- Dataset provides helpful hints to what it is, ie. Number or Text; with support for grammar type (expect a proper-noun for instance).
- Dataset variables will be converted on export to their proper fashion. (ie. Android variables become `%1$s`)
- Context, Description, and Note elements for explaining the meaning (acts as comments and not exported)

## Example markdown
Check the examples folder for the files that reflect this

```xml
<?rhema version="1.0" encoding="UTF-8" ?>
<language xmlns="rhema.100" source="en">
    <notes>
        <note>Scrabble note here</note>
        <note op="chris" time="2018-01-01T12-00-00">Labeled note</note>
    </notes>
    <desc>Description of this object; if at root level, describes the file then</desc>
    <group id="general" platform="all">
        <entry id="hello_world" platform="ios,android">
            <dataset>
                <text id="name" sizeMax=128 grammar="proper-noun"  />
            </dataset>
            <source>Hello [name]</source>
        </entry>
    </group>
</language>
```


Exports to JSON as:

```json
{
    "en": {
        "general": {
            "hello_world": "Hello ${name}"
        }
    }
}
```


## Nodes, and Format
Each file is prefixed with the XML processor instruction:
`<?rhema version="1.0" ?>`

### Project file (*.RLP)
| Element | Required? | Description |
| :--- | :---: | :--- |
| `project` | Y | Declares this is a project outline, must be first node |
| `files` | Y | Starts the list of `file` objects |
| `base` | Y | Declares the 'base' or master file, inherits from `file`, all attributes apply |
| `file` |   | Describes the locations and language of a file this project references |

### Translation file (*.RLF)
| Element | Required? | Description |
| :--- | :---: | :--- |
| `language` | Y | Declares this is a language outline, must be first node |
| `group` |   | Group block of child groups or entries, requires an ID |
| `entry` |   | Specifies a specific language entry requires an ID |
| `source` | If no target | The source string, or one to be translated |
| `target` | If no source | The source string, translated into the target language |
| `dataset` |   | Groups the data entries for an entry, to help with variables |
| `text` |   | Data variable of a textual type, can declare it's grammar hint, requires ID |
| `number` |   | Data variable of a numeric type, requires ID |
| `notes` |   | A block of notes designed for developer<->translator communication |
| `desc` |   | Describes it's block, meant as a context explanation |
