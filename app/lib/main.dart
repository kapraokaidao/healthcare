import 'package:flutter/material.dart';
import 'package:healthcare_app/screens/account/prrofile_screen.dart';
import 'package:healthcare_app/screens/start/start_screen.dart';
import 'package:provider/provider.dart';
import 'package:healthcare_app/models/NavItem.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (context) => NavItems(),
      child: MaterialApp(
        debugShowCheckedModeBanner: false,
        title: 'Healthcare App',
        theme: ThemeData(
          // backgroundColor: Colors.white,
          scaffoldBackgroundColor: Colors.white,
          // We apply this to our appBarTheme because most of our appBar have this style
          appBarTheme: AppBarTheme(color: Colors.white, elevation: 0),
          visualDensity: VisualDensity.adaptivePlatformDensity,
        ),
        home: StartScreen(),
      ),
    );
  }
}
