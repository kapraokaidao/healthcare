import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:provider/provider.dart';
import 'package:healthcare_app/constants.dart';
import 'package:healthcare_app/models/NavItem.dart';
import 'package:healthcare_app/size_config.dart';
import 'package:page_transition/page_transition.dart';

class MyBottomNavBar extends StatelessWidget {
  const MyBottomNavBar({
    Key key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    double defaultSize = SizeConfig.defaultSize;
    return Consumer<NavItems>(
      builder: (context, navItems, child) => Container(
        padding: EdgeInsets.symmetric(horizontal: defaultSize * 3), //30
        // just for demo
        // height: 80,
        decoration: BoxDecoration(
          color: Colors.white,
          boxShadow: [
            BoxShadow(
              offset: Offset(0, -7),
              blurRadius: 30,
              color: Color(0xFF4B1A39).withOpacity(0.2),
            ),
          ],
        ),
        child: SafeArea(
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: List.generate(
              navItems.items.length,
              (index) => buildIconNavBarItem(
                  isActive: navItems.selectedIndex == index ? true : false,
                  icon: navItems.items[index].icon,
                  press: () {
                    navItems.changeNavIndex(index: index);
                    // maybe destinationChacker is not needed in future because then all of our nav items have destination
                    // But Now if we click those which dont have destination then it shows error
                    // And this fix this problem
                    if (navItems.items[index].destinationChecker())
                      Navigator.push(
                        context,
                        PageTransition(
                            type: PageTransitionType.fade,
                            child: navItems.items[index].destination),
                      );
                  },
                  title: navItems.items[index].title),
            ),
          ),
        ),
      ),
    );
  }

  Column buildIconNavBarItem(
      {String icon, Function press, bool isActive = false, String title}) {
    return Column(mainAxisSize: MainAxisSize.min, children: [
      IconButton(
        icon: SvgPicture.asset(
          icon,
          color: isActive ? kPrimaryColor : Color(0xFFD1D4D4),
          height: 22,
        ),
        onPressed: press,
      ),
      Text(title)
    ]);
  }
}
