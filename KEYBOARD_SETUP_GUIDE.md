# 🎮 Unity Keyboard Implementation Guide

## 📋 Step 1: Add Scripts to Your Project

1. **Create a new folder** in your Unity project: `Assets/Scripts`
2. **Add these two C# scripts:**
   - `KeyboardManager.cs` - Manages keyboard display
   - `InputFieldHandler.cs` - Handles input field clicks

## 🛠️ Step 2: Setup in Your Scene

### Option A: Using TextMeshPro InputFields (Recommended)

1. **Create the KeyboardManager:**
   - Create an empty GameObject in your scene
   - Name it: `KeyboardManager`
   - Attach the `KeyboardManager.cs` script to it
   - (This only needs to be done once per scene)

2. **For each InputField:**
   - Select the InputField GameObject
   - Click "Add Component"
   - Search for and add `InputFieldHandler` script
   - In the Inspector, set the **Field Type**:
     - `Text` - Regular text
     - `Password` - Password (hidden characters)
     - `Email` - Email keyboard with @ symbol
     - `Number` - Numeric only

### Option B: Using Legacy UI InputField

Same steps as above, but the script automatically detects the legacy InputField component.

## 📱 How It Works

1. User taps on an InputField
2. `InputFieldHandler` detects the click
3. Calls `KeyboardManager.ShowKeyboard()` (or appropriate keyboard type)
4. Native mobile keyboard appears automatically
5. User types text
6. Text goes into the InputField
7. Keyboard closes when user is done

## 🔑 Keyboard Types Available

- **Text** - Standard QWERTY keyboard
- **Password** - Hidden input keyboard
- **Email** - Keyboard with @ and . symbols
- **Number** - Numeric keypad only

## ✅ Testing

1. Build your project for Android/iOS
2. Deploy to a mobile device
3. Click on any InputField
4. Native keyboard should appear automatically
5. Type your text

## 🐛 Debugging

- Check the **Console** in Unity Editor
- You'll see logs like:
  - `[KeyboardManager] Initialized`
  - `[InputFieldHandler] Input field selected: FieldName`
  - `[KeyboardManager] Opening keyboard for: FieldName`

## 💡 Tips

- The keyboard appears automatically - you don't need to call anything manually
- The keyboard type is determined by the `Field Type` setting on each InputFieldHandler
- Works on both Android and iOS
- Also works in the Editor if you use mobile simulation

## 🔄 Alternative: Manual Trigger

If you want to trigger the keyboard manually from code:

```csharp
InputFieldHandler handler = myInputField.GetComponent<InputFieldHandler>();
handler.SetKeyboardType(InputFieldHandler.InputFieldType.Password);
```

---

**That's it! Your keyboard should now work perfectly!** 🎉
