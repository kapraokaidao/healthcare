import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:healthcare_app/authentication/bloc/authentication_bloc.dart';
import 'package:healthcare_app/authentication/authentication.dart';
import 'package:healthcare_app/repositories/index.dart';
import 'package:healthcare_app/screens/main_menu.dart';
import 'package:healthcare_app/screens/redeem/redeem_screen.dart';
import 'package:healthcare_app/screens/token/token_screen.dart';
import 'package:healthcare_app/screens/transfer/transfer_screen.dart';
import 'package:healthcare_app/theme/theme.dart';
import 'package:healthcare_app/utils/index.dart';
import 'package:provider/provider.dart';
import 'package:flutter/material.dart';
import 'package:healthcare_app/screens/start/start_screen.dart';
import 'package:healthcare_app/models/NavItem.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:healthcare_app/authentication/bloc/authentication_bloc.dart';
import 'start/start_screen.dart';

class MainMenu extends StatefulWidget {
  static Route route() {
    return MaterialPageRoute(builder: (_) => MainMenu());
  }

  @override
  _MainMenuState createState() => _MainMenuState();
}

class _MainMenuState extends State<MainMenu> {
  int currentIndex = 0;
  PageController _pageController;

  @override
  void initState() {
    super.initState();
    _pageController = PageController(initialPage: currentIndex, keepPage: true);
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<AuthenticationBloc, AuthenticationState>(
        builder: (ctx, state) {
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
          home: _Polling(),
        ),
      );
    });
  }
}

class _Polling extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return BlocBuilder<AuthenticationBloc, AuthenticationState>(
        builder: (ctx, state) {
      Timer.periodic(Duration(seconds: 5), (timer) async {
        if (state.status == AuthenticationStatus.authenticated) {
          final response = await HttpClient.get(
              path: '/healthcare-token/redeem-request/active');
          if (response.containsKey("id")) {
            timer.cancel();
            Navigator.push(context, TransferScreen.route(response));
          }
        } else {
          timer.cancel();
        }
      });

      return StartScreen();
    });
  }
}
