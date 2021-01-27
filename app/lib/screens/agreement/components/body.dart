import 'package:flutter/material.dart';
import 'package:healthcare_app/screens/redeem/redeem_screen.dart';
import 'package:healthcare_app/screens/register/register_screen.dart';

class Body extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.all(40),
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'Agreement',
              style: TextStyle(fontSize: 40),
            ),
            Container(
              child: Text('something'),
            ),
            Row(
              children: [Text('Check box')],
            ),
            OutlineButton(
              onPressed: () {
                Navigator.push(
                  context,
                  RedeemScreen.route(),
                );
              },
              child: Text('Next'),
            )
          ],
        ),
      ),
    );
  }
}
