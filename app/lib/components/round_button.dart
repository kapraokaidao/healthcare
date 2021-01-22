import 'package:flutter/material.dart';

class RoundButton extends StatelessWidget {
  final Key key;
  final VoidCallback onPressed;
  final String title;
  final dynamic iconData;
  final Color color;
  final Color textColor;
  final double fontSize;
  final double height;
  final double borderRadius;
  final double elevation;
  final bool fullWidth;
  final Axis direction;

  RoundButton({
    this.key,
    @required this.onPressed,
    @required this.title,
    this.iconData,
    this.color,
    this.textColor = Colors.white,
    this.fontSize = 20,
    this.height = 40,
    this.borderRadius,
    this.elevation = 5,
    this.fullWidth = true,
    this.direction = Axis.horizontal,
  }) : super(key: key);

  Widget _icon() {
    if (this.iconData is IconData) {
      return Icon(
        this.iconData,
        color: this.textColor,
      );
    }

    return this.iconData;
  }

  Widget _buttonChild() {
    if (iconData != null) {
      return Flex(
        children: [
          _icon(),
          SizedBox(width: 8),
          Text(this.title,
              style: TextStyle(
                color: this.textColor,
                fontSize: this.fontSize,
              ))
        ],
        direction: this.direction,
        mainAxisAlignment: MainAxisAlignment.center,
      );
    }

    return Text(this.title,
        style: TextStyle(
          color: this.textColor,
          fontSize: this.fontSize,
        ));
  }

  Widget _buttonContent() {
    double radius = this.borderRadius;
    if (borderRadius == null) {
      radius = this.height / 2;
    }

    return SizedBox(
      height: this.height,
      child: RaisedButton(
        onPressed: this.onPressed,
        child: _buttonChild(),
        color: this.color,
        elevation: this.elevation,
        shape: RoundedRectangleBorder(
            borderRadius: new BorderRadius.circular(radius)),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (this.fullWidth) {
      return FractionallySizedBox(child: _buttonContent(), widthFactor: 1);
    }

    return Wrap(children: [_buttonContent()]);
  }
}
