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
  final String title;

  NavItem({this.id, this.icon, this.destination, this.title});

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
    NavItem(
        id: 1,
        icon: "assets/icons/privilege.svg",
        destination: TokenScreen(),
        title: 'สิทธิ'),
    NavItem(
        id: 2,
        icon: "assets/icons/add.svg",
        destination: ValidTokenScreen(),
        title: 'รับสิทธิ'),
    NavItem(
        id: 3,
        icon: "assets/icons/health.svg",
        destination: HealthScreen(),
        title: 'สุขภาพ'),
    NavItem(
        id: 4,
        icon: "assets/icons/history.svg",
        destination: HistoryScreen(),
        title: 'ประวัติ '),
    NavItem(
        id: 5,
        icon: "assets/icons/profile.svg",
        destination: AccountScreen(),
        title: 'บัญชี'),
  ];
}
