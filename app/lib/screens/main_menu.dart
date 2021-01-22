import 'package:flutter/material.dart';
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
    return BlocBuilder<AuthenticationBloc, AuthenticationState>(builder: (ctx, state) {
      return Text(state.user.username);
    });
  }
}