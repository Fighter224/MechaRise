#if UNITY_EDITOR
using UnityEditor;
using UnityEngine;

// Copy this file to Assets/Editor and modular/ to Assets/MechaRise/Lobby/modular/.
// Import configuration only: does not create scenes or overwrite source images.
public sealed class MechaRiseLobbyImporter : AssetPostprocessor
{
    void OnPreprocessTexture()
    {
        if (!assetPath.Contains("/MechaRise/Lobby/modular/") || !assetPath.EndsWith(".png")) return;
        if (assetPath.Contains("/source/")) return;
        var texture = (TextureImporter)assetImporter;
        texture.textureType = TextureImporterType.Sprite;
        texture.spriteImportMode = SpriteImportMode.Single;
        texture.alphaIsTransparency = true;
        texture.mipmapEnabled = false;
        texture.textureCompression = TextureImporterCompression.Uncompressed;
        texture.maxTextureSize = 2048;
        texture.spritePixelsPerUnit = 100;
        texture.filterMode = assetPath.Contains("/pilot/") ? FilterMode.Point : FilterMode.Bilinear;
        var settings = new TextureImporterSettings();
        texture.ReadTextureSettings(settings);
        settings.spriteAlignment = (int)SpriteAlignment.Custom;
        settings.spritePivot = assetPath.Contains("/pilot/") ? new Vector2(.5f, .02f)
            : assetPath.Contains("/tiles/") ? new Vector2(.5f, .5f) : new Vector2(.5f, .06f);
        texture.SetTextureSettings(settings);
    }
}
#endif
