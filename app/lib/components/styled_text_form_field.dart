import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:healthcare_app/theme/dimensions.dart';

class StyledTextFormField extends StatelessWidget {
  final double borderRadius;
  final String initialValue;
  final TextInputType keyboardType;
  final TextStyle style;
  final TextAlign textAlign;
  final TextAlignVertical textAlignVertical;
  final bool autofocus;
  final bool readOnly;
  final bool autoValidate;
  final bool maxLengthEnforced;
  final int maxLines;
  final int minLines;
  final int maxLength;
  final Function(String) onChanged;
  final Function() onTap;
  final Function() onEditingComplete;
  final Function(String) onFieldSubmitted;
  final Function(String) onSaved;
  final Function(String) validator;
  final List<TextInputFormatter> inputFormatters;
  final bool enabled;
  final TextEditingController controller;
  final FocusNode focusNode;
  final TextInputAction textInputAction;
  final String errorText;
  final String hintText;
  final bool obscureText;

  StyledTextFormField({
    Key key,
    this.borderRadius = 40,
    this.initialValue,
    this.keyboardType,
    this.style,
    this.textAlign = TextAlign.start,
    this.textAlignVertical,
    this.autofocus = false,
    this.readOnly = false,
    this.autoValidate = false,
    this.maxLengthEnforced = true,
    this.maxLines,
    this.minLines,
    this.maxLength,
    this.onChanged,
    this.onTap,
    this.onEditingComplete,
    this.onFieldSubmitted,
    this.onSaved,
    this.validator,
    this.inputFormatters,
    this.enabled,
    this.controller,
    this.focusNode,
    this.textInputAction = TextInputAction.done,
    this.errorText,
    this.hintText,
    this.obscureText = false,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      cursorColor: Theme.of(context).primaryColor,
      decoration: InputDecoration(
        border: OutlineInputBorder()
            .copyWith(borderRadius: BorderRadius.circular(borderRadius)),
        enabledBorder: OutlineInputBorder().copyWith(
            borderSide: BorderSide(color: Colors.grey[300]),
            borderRadius: BorderRadius.circular(borderRadius)),
        contentPadding:
        EdgeInsets.symmetric(vertical: spacing, horizontal: spacing * 2),
        filled: true,
        fillColor: Colors.white,
        errorText: errorText,
        hintStyle: TextStyle(color: Colors.grey[300], fontWeight: FontWeight.w200),
        hintText: hintText,
      ),
      initialValue: initialValue,
      keyboardType: keyboardType,
      style: style,
      textAlign: textAlign,
      textAlignVertical: textAlignVertical,
      autofocus: autofocus,
      readOnly: readOnly,
      autovalidate: autoValidate,
      maxLengthEnforced: maxLengthEnforced,
      maxLines: obscureText ? 1 : maxLines,
      minLines: minLines,
      maxLength: maxLength,
      onChanged: onChanged,
      onTap: onTap,
      onEditingComplete: onEditingComplete,
      onFieldSubmitted: onFieldSubmitted,
      onSaved: onSaved,
      validator: validator,
      inputFormatters: inputFormatters,
      enabled: enabled,
      controller: controller,
      focusNode: focusNode,
      textInputAction: textInputAction,
      obscureText: obscureText,
    );
  }
}
