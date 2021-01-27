import 'package:flutter/material.dart';

const Color _kPrimaryColor = Color.fromRGBO(208, 164, 136, 1);
const Color _kPrimaryLightColor = Color.fromRGBO(255, 213, 184, 1);
const Color _kPrimaryDarkColor = Color.fromRGBO(158, 117, 91, 1);
const Color _kDeActiveColor = Color.fromRGBO(198, 198, 198, 1);
const Color _kTextPrimaryColor = Color.fromRGBO(80, 94, 110, 1);
const Color _kTextSecondaryColor = Color.fromRGBO(155, 155, 155, 1);
const Color _kPrimaryBackgroundColor = Color.fromRGBO(244, 239, 236, 1);
const Color successColor = Color.fromRGBO(103, 213, 96, 1);
const Color errorColor = Colors.red;
const Color navigationItemColor = Color.fromRGBO(110, 83, 62, 1);
const Color selectedNavigationItemColor = Colors.white;

ThemeData _buildDefaultTheme() {
  return ThemeData(
    accentColor: _kPrimaryColor,
    brightness: Brightness.light,
    primaryColor: _kPrimaryColor,
    primaryColorLight: _kPrimaryLightColor,
    primaryColorDark: _kPrimaryDarkColor,
    disabledColor: _kDeActiveColor,
    colorScheme: ColorScheme(primary: _kPrimaryColor,
        primaryVariant: _kPrimaryColor ,
        secondary: _kPrimaryLightColor,
        secondaryVariant: _kPrimaryLightColor,
        surface: _kPrimaryColor,
        background: _kPrimaryBackgroundColor,
        error: errorColor,
        onPrimary: _kTextPrimaryColor,
        onSecondary: _kPrimaryLightColor,
        onSurface: _kTextPrimaryColor,
        onBackground: _kPrimaryBackgroundColor,
        onError: errorColor,
        brightness: Brightness.light),
    fontFamily: "Sarabun",
    buttonColor: _kPrimaryColor,
    textTheme: TextTheme(
      headline1: TextStyle(color: _kTextPrimaryColor, fontSize: 34),
      headline2: TextStyle(color: _kTextPrimaryColor, fontSize: 32),
      headline3: TextStyle(color: _kTextPrimaryColor, fontSize: 30),
      headline4: TextStyle(color: _kTextPrimaryColor, fontSize: 28),
      headline5: TextStyle(color: _kTextPrimaryColor, fontSize: 24),
      headline6: TextStyle(color: _kTextPrimaryColor, fontSize: 22),
      subtitle1: TextStyle(
          color: _kTextPrimaryColor,
          fontSize: 20,
          fontWeight: FontWeight.bold),
      subtitle2: TextStyle(
          color: _kTextPrimaryColor,
          fontSize: 18,
          fontWeight: FontWeight.bold),
      bodyText1: TextStyle(color: _kTextPrimaryColor, fontSize: 20),
      bodyText2: TextStyle(color: _kTextPrimaryColor, fontSize: 18),
      caption: TextStyle(color: _kTextSecondaryColor, fontSize: 16),
    ),
    splashColor: Colors.transparent,
    scaffoldBackgroundColor: _kPrimaryBackgroundColor,
  );
}

final ThemeData defaultTheme = _buildDefaultTheme();
