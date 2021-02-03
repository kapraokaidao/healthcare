import 'package:flutter/material.dart';
import 'package:healthcare_app/screens/account/account_screen.dart';
import 'package:healthcare_app/screens/health/health_screen.dart';
import 'package:healthcare_app/screens/history/history_screen.dart';
import 'package:healthcare_app/screens/token/token_screen.dart';
import 'package:healthcare_app/screens/valid_token/valid_token_screen.dart';

class NavItem {
  final int id;
  final String icon;
  final Widget destination;

  NavItem({this.id, this.icon, this.destination});

// If there is no destination then it help us
  bool destinationChecker() {
    if (destination != null) {
      return true;
    }
    return false;
  }
}

// If we made any changes here Provider package rebuid those widget those use this NavItems
class NavItems extends ChangeNotifier {
  // By default first one is selected
  int selectedIndex = 0;

  void changeNavIndex({int index}) {
    selectedIndex = index;
    // if any changes made it notify widgets that use the value
    notifyListeners();
  }

  List<NavItem> items = [
    NavItem(id: 1, icon: "assets/icons/inbox.svg", destination: TokenScreen()),
    NavItem(
        id: 1,
        icon: "assets/icons/paper-plane.svg",
        destination: ValidTokenScreen()),
    NavItem(
      id: 3,
      icon: "assets/icons/health.svg",
      destination: HealthScreen(),
    ),
    NavItem(
      id: 4,
      icon: "assets/icons/history.svg",
      destination: HistoryScreen(),
    ),
    NavItem(
      id: 5,
      icon: "assets/icons/profile.svg",
      destination: AccountScreen(),
    ),
  ];
}
