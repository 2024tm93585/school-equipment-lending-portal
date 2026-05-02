# Custom Dialog System ✨

## Overview
Replaced all browser default popups (`window.confirm`, `window.prompt`, `window.alert`) with elegant, custom modal dialogs that provide a better user experience with proper titles and styling.

---

## Problem with Browser Popups

### Before (Browser Default)
```javascript
window.confirm('Are you sure?')
// Shows: "localhost:3000 says: Are you sure?"

window.prompt('Enter value:')
// Shows: "localhost:3000 says: Enter value:"

window.alert('Success!')
// Shows: "localhost:3000 says: Success!"
```

**Issues:**
- ❌ Shows "localhost:3000 says" prefix
- ❌ Cannot customize styling
- ❌ No icons or visual hierarchy
- ❌ Inconsistent across browsers
- ❌ Blocks the entire browser
- ❌ Not mobile-friendly

### After (Custom Dialogs)
```javascript
<ConfirmDialog
  title="Approve Request"
  message="Are you sure you want to approve this borrow request?"
/>
```

**Benefits:**
- ✅ Custom titles (no "localhost:3000 says")
- ✅ Beautiful styling with icons
- ✅ Consistent across all browsers
- ✅ Mobile-responsive
- ✅ Smooth animations
- ✅ Better UX

---

## Custom Dialog Components

### 1. **ConfirmDialog** - For Yes/No Confirmations

**Purpose**: Replace `window.confirm()`

**Features**:
- Custom title and message
- Configurable button text
- Type-based styling (success, danger, info)
- Icon based on type
- Cancel and Confirm buttons

**Usage**:
```javascript
import ConfirmDialog from '../components/ConfirmDialog';

const [confirmDialog, setConfirmDialog] = useState({ isOpen: false });

<ConfirmDialog
  isOpen={confirmDialog.isOpen}
  onClose={() => setConfirmDialog({ isOpen: false })}
  onConfirm={handleConfirm}
  title="Delete Equipment"
  message="Are you sure you want to delete this equipment? This action cannot be undone."
  confirmText="Delete"
  cancelText="Cancel"
  type="danger"
/>
```

**Types**:
- `confirm` (default) - ❓ Blue theme
- `success` - ✅ Green theme
- `danger` - ⚠️ Red theme
- `info` - ℹ️ Blue theme

---

### 2. **PromptDialog** - For User Input

**Purpose**: Replace `window.prompt()`

**Features**:
- Custom title and message
- Text input, textarea, or select dropdown
- Placeholder text
- Default values
- Form validation
- Submit and Cancel buttons

**Usage - Text Input**:
```javascript
import PromptDialog from '../components/PromptDialog';

const [promptDialog, setPromptDialog] = useState({ isOpen: false });

<PromptDialog
  isOpen={promptDialog.isOpen}
  onClose={() => setPromptDialog({ isOpen: false })}
  onSubmit={handleSubmit}
  title="Reject Request"
  message="Please provide a reason for rejecting this request:"
  placeholder="Enter rejection reason..."
  inputType="textarea"
/>
```

**Usage - Select Dropdown**:
```javascript
<PromptDialog
  isOpen={returnDialog.isOpen}
  onClose={() => setReturnDialog({ isOpen: false })}
  onSubmit={handleReturn}
  title="Mark Equipment as Returned"
  message="Please select the condition of the returned equipment:"
  options={[
    { value: 'excellent', label: 'Excellent - Like new condition' },
    { value: 'good', label: 'Good - Minor wear and tear' },
    { value: 'fair', label: 'Fair - Noticeable wear' },
    { value: 'poor', label: 'Poor - Significant wear' },
    { value: 'damaged', label: 'Damaged - Requires repair' }
  ]}
/>
```

**Input Types**:
- `text` (default) - Single line text input
- `textarea` - Multi-line text input
- `options` - Dropdown select (pass options array)

---

### 3. **AlertDialog** - For Notifications

**Purpose**: Replace `window.alert()`

**Features**:
- Custom title and message
- Type-based styling and icons
- Single OK button
- Auto-focus on OK button

**Usage**:
```javascript
import AlertDialog from '../components/AlertDialog';

const [alertDialog, setAlertDialog] = useState({ 
  isOpen: false, 
  title: '', 
  message: '', 
  type: 'info' 
});

<AlertDialog
  isOpen={alertDialog.isOpen}
  onClose={() => setAlertDialog({ isOpen: false })}
  title="Registration Successful"
  message="Your account has been created successfully! You can now login with your credentials."
  type="success"
/>
```

**Types**:
- `info` (default) - ℹ️ Blue theme
- `success` - ✅ Green theme
- `error` - ❌ Red theme
- `warning` - ⚠️ Orange theme

---

## Implementation Examples

### Example 1: Approve Request (ConfirmDialog)

**Before**:
```javascript
const handleApprove = async (requestId) => {
  if (!window.confirm('Are you sure you want to approve this request?')) {
    return;
  }
  // Approve logic
};
```

**After**:
```javascript
const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, requestId: null });

const handleApprove = (requestId) => {
  setConfirmDialog({ isOpen: true, requestId });
};

const confirmApprove = async () => {
  // Approve logic using confirmDialog.requestId
};

<ConfirmDialog
  isOpen={confirmDialog.isOpen}
  onClose={() => setConfirmDialog({ isOpen: false, requestId: null })}
  onConfirm={confirmApprove}
  title="Approve Request"
  message="Are you sure you want to approve this borrow request?"
  type="success"
/>
```

---

### Example 2: Reject Request (PromptDialog)

**Before**:
```javascript
const handleReject = async (requestId) => {
  const notes = window.prompt('Enter rejection reason (optional):');
  if (notes === null) return;
  // Reject logic with notes
};
```

**After**:
```javascript
const [rejectDialog, setRejectDialog] = useState({ isOpen: false, requestId: null });

const handleReject = (requestId) => {
  setRejectDialog({ isOpen: true, requestId });
};

const confirmReject = async (notes) => {
  // Reject logic with notes
};

<PromptDialog
  isOpen={rejectDialog.isOpen}
  onClose={() => setRejectDialog({ isOpen: false, requestId: null })}
  onSubmit={confirmReject}
  title="Reject Request"
  message="Please provide a reason for rejecting this request (optional):"
  placeholder="Enter rejection reason..."
  inputType="textarea"
/>
```

---

### Example 3: Registration Success (AlertDialog)

**Before**:
```javascript
if (result.success) {
  alert('Registration successful! Please login.');
  navigate('/login');
}
```

**After**:
```javascript
const [successDialog, setSuccessDialog] = useState(false);

if (result.success) {
  setSuccessDialog(true);
}

const handleSuccessClose = () => {
  setSuccessDialog(false);
  navigate('/login');
};

<AlertDialog
  isOpen={successDialog}
  onClose={handleSuccessClose}
  title="Registration Successful"
  message="Your account has been created successfully! You can now login with your credentials."
  type="success"
/>
```

---

## Styling Features

### Visual Design
- **Gradient header**: Subtle gradient background
- **Icons**: Emoji icons for visual appeal
- **Rounded corners**: 12px border radius
- **Shadow**: Elevated appearance with box-shadow
- **Animations**: Smooth fade-in and slide-up

### Color Themes

#### Success (Green)
- Icon: ✅
- Button: Green gradient
- Use for: Approvals, confirmations, success messages

#### Danger (Red)
- Icon: ⚠️
- Button: Red gradient
- Use for: Deletions, rejections, destructive actions

#### Info (Blue)
- Icon: ℹ️
- Button: Blue gradient
- Use for: General information, neutral actions

#### Warning (Orange)
- Icon: ⚠️
- Button: Orange gradient
- Use for: Warnings, cautions

---

## Responsive Design

### Desktop
- Centered modal
- Max width: 500px
- Horizontal button layout

### Mobile
- Full-width modal (95%)
- Vertical button layout
- Touch-friendly spacing
- Larger tap targets

---

## Accessibility Features

✅ **Keyboard Navigation**
- ESC key closes dialog
- Tab navigation between buttons
- Auto-focus on primary action

✅ **Screen Readers**
- Semantic HTML structure
- Proper ARIA labels
- Clear button text

✅ **Visual Feedback**
- Clear hover states
- Focus indicators
- Loading states

---

## Files Created

1. **`frontend/src/components/ConfirmDialog.js`** - Confirmation dialog component
2. **`frontend/src/components/PromptDialog.js`** - Input prompt dialog component
3. **`frontend/src/components/AlertDialog.js`** - Alert notification dialog component

## Files Modified

1. **`frontend/src/App.css`** - Added dialog styles
2. **`frontend/src/pages/ManageRequestsPage.js`** - Replaced 3 popups
3. **`frontend/src/pages/ManageEquipmentPage.js`** - Replaced 1 popup
4. **`frontend/src/pages/RegisterPage.js`** - Replaced 1 popup

---

## Replaced Popups Summary

### ManageRequestsPage
1. ✅ Approve confirmation → ConfirmDialog
2. ✅ Reject reason prompt → PromptDialog (textarea)
3. ✅ Return condition prompt → PromptDialog (select)
4. ✅ Invalid condition alert → AlertDialog

### ManageEquipmentPage
1. ✅ Delete confirmation → ConfirmDialog

### RegisterPage
1. ✅ Registration success alert → AlertDialog

**Total**: 6 browser popups replaced with custom dialogs

---

## Benefits Summary

### User Experience
- ✅ No more "localhost:3000 says" prefix
- ✅ Professional appearance
- ✅ Consistent styling across app
- ✅ Better mobile experience
- ✅ Smooth animations

### Developer Experience
- ✅ Reusable components
- ✅ Easy to customize
- ✅ Type-safe props
- ✅ Consistent API
- ✅ Better maintainability

### Technical
- ✅ React-based (no browser blocking)
- ✅ Fully responsive
- ✅ Accessible
- ✅ Performant
- ✅ Cross-browser compatible

---

## Testing

To test the new dialogs:

1. **Approve Request**
   - Login as admin
   - Go to "Manage Requests"
   - Click "Approve" on a pending request
   - See custom confirmation dialog

2. **Reject Request**
   - Click "Reject" on a pending request
   - See custom prompt dialog with textarea

3. **Mark Returned**
   - Click "Mark Returned" on an approved request
   - See custom prompt dialog with dropdown

4. **Delete Equipment**
   - Go to "Manage Equipment"
   - Click "Delete" on any equipment
   - See custom confirmation dialog

5. **Register Account**
   - Go to Register page
   - Fill form and submit
   - See custom success alert

---

## Future Enhancements (Optional)

1. **Toast Notifications**
   - Non-blocking notifications
   - Auto-dismiss after timeout
   - Stack multiple toasts

2. **Loading States**
   - Show spinner during async operations
   - Disable buttons while processing

3. **Custom Icons**
   - Use icon library (FontAwesome, Material Icons)
   - More icon options

4. **Sound Effects**
   - Optional sound on confirm/cancel
   - Accessibility consideration

5. **Keyboard Shortcuts**
   - Enter to confirm
   - ESC to cancel
   - Already implemented!

---

## Conclusion

All browser default popups have been successfully replaced with elegant, custom modal dialogs. The new system provides:

✨ **Better UX** - No more "localhost:3000 says"
🎨 **Beautiful Design** - Icons, gradients, animations
📱 **Mobile-Friendly** - Fully responsive
♿ **Accessible** - Keyboard navigation, screen readers
🔧 **Maintainable** - Reusable components

The application now has a professional, polished appearance with consistent dialog styling throughout! 🎉
