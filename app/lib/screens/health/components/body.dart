import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:healthcare_app/authentication/bloc/authentication_bloc.dart';

class Body extends StatefulWidget {
  Body({Key key}) : super(key: key);
  @override
  _BodyState createState() => _BodyState();
}

class _BodyState extends State<Body> {
  final rowSpacer =
      TableRow(children: [SizedBox(height: 20), SizedBox(height: 20)]);

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<AuthenticationBloc, AuthenticationState>(
        builder: (ctx, state) {
      if (state.user != null) {
        return Column(
          children: [
            Container(
                margin: EdgeInsets.all(20),
                padding: EdgeInsets.all(20),
                child: Table(
                  children: [
                    TableRow(children: [
                      Text('Name',
                          style: TextStyle(fontWeight: FontWeight.bold)),
                      Text("N")
                    ]),
                    rowSpacer,
                    TableRow(children: [
                      Text('Description',
                          style: TextStyle(fontWeight: FontWeight.bold)),
                      Text("D")
                    ]),
                    rowSpacer,
                    TableRow(children: [
                      Text('Balance',
                          style: TextStyle(fontWeight: FontWeight.bold)),
                      Text("B")
                    ])
                  ],
                ),
                width: double.infinity,
                decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(10),
                    color: Colors.white,
                    border: Border.all(
                      color: Colors.grey,
                      style: BorderStyle.solid,
                      width: 1,
                    )))
          ],
        );
      }
    });
  }
}
